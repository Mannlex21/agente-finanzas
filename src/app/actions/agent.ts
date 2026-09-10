"use server";

import { generateObject } from "ai";
import { revalidatePath } from "next/cache";
import { AccountType, TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAIModel } from "@/lib/ai/model";
import {
	extractedTransactionSchema,
	type ExtractedTransaction,
} from "@/lib/schemas/agent";

export type ProcessedTransaction = {
	id: string;
	amount: number;
	type: ExtractedTransaction["type"];
	category: string;
	description: string;
	accountName: string;
	date: string;
	accountBalance: number;
};

export type ProcessFinancialPromptResult =
	| { success: true; extracted: ExtractedTransaction; transaction: ProcessedTransaction }
	| { success: false; error: string };

function resolveAccount<T extends { id: string; name: string }>(
	accounts: T[],
	accountName: string,
): T | null {
	const normalized = accountName.trim().toLowerCase();
	if (!normalized) return null;

	const exact = accounts.find((a) => a.name.toLowerCase() === normalized);
	if (exact) return exact;

	const includes = accounts.find(
		(a) =>
			a.name.toLowerCase().includes(normalized) ||
			normalized.includes(a.name.toLowerCase()),
	);
	if (includes) return includes;

	const tokens = normalized.split(/\s+/).filter((t) => t.length > 2);
	return (
		accounts.find((a) =>
			tokens.some((token) => a.name.toLowerCase().includes(token)),
		) ?? null
	);
}

function mapPrismaType(
	type: ExtractedTransaction["type"],
): TransactionType {
	return type === "income" ? TransactionType.ingreso : TransactionType.gasto;
}

function balanceDelta(
	accountType: AccountType,
	type: ExtractedTransaction["type"],
	amount: number,
): number {
	const isIncome = type === "income";
	if (accountType === AccountType.credit_card) {
		return isIncome ? -amount : amount;
	}
	return isIncome ? amount : -amount;
}

function parseTransactionDate(isoDate: string): Date {
	const parsed = new Date(isoDate);
	if (Number.isNaN(parsed.getTime())) {
		return new Date();
	}
	return parsed;
}

export async function processFinancialPrompt(
	message: string,
): Promise<ProcessFinancialPromptResult> {
	const prompt = message.trim();
	if (!prompt) {
		return { success: false, error: "Escribe un mensaje para procesar." };
	}

	const accounts = await prisma.financialAccount.findMany({
		select: { id: true, name: true, type: true, balance: true },
		orderBy: { name: "asc" },
	});

	if (accounts.length === 0) {
		return {
			success: false,
			error: "No hay cuentas registradas. Crea una cuenta antes de usar el agente.",
		};
	}

	const accountNames = accounts.map((a) => a.name);
	const todayIso = new Date().toISOString();

	try {
		const { object } = await generateObject({
			model: getAIModel(),
			schema: extractedTransactionSchema,
			temperature: 0,
			system: `Eres un agente de finanzas personales. Extrae UNA transacción estructurada del texto del usuario.

Cuentas válidas (usa exactamente uno de estos nombres en accountName):
${accountNames.map((n) => `- ${n}`).join("\n")}

Reglas:
- amount: número positivo, sin comas ni símbolos.
- type: expense (gasto), income (ingreso), transfer (transferencia o movimiento entre cuentas).
- category: una categoría corta en español (Alimentación, Transporte, Servicios, Entretenimiento, etc.).
- description: resumen breve y limpio (comercio o concepto).
- accountName: elige la cuenta más cercana de la lista. Si mencionan BBVA, Visa, efectivo, etc., resuélvelo a un nombre de la lista.
- date: ISO 8601. Si no hay fecha, usa ${todayIso}.
- No inventes montos. Si falta el monto, no completes datos ficticios; usa 0 solo si es imposible extraerlo (evítalo).`,
			prompt,
		});

		const extracted = object;
		const account = resolveAccount(accounts, extracted.accountName);

		if (!account) {
			return {
				success: false,
				error: `No se encontró la cuenta "${extracted.accountName}". Cuentas disponibles: ${accountNames.join(", ")}.`,
			};
		}

		const amount = extracted.amount;
		const tipo = mapPrismaType(extracted.type);
		const occurredAt = parseTransactionDate(extracted.date);
		const delta = balanceDelta(account.type, extracted.type, amount);

		const result = await prisma.$transaction(async (tx) => {
			const created = await tx.transaction.create({
				data: {
					comercio: extracted.description,
					monto: amount,
					categoria: extracted.category,
					tipo,
					accountId: account.id,
					createdAt: occurredAt,
				},
			});

			const updatedAccount = await tx.financialAccount.update({
				where: { id: account.id },
				data: { balance: { increment: delta } },
			});

			return { created, updatedAccount };
		});

		revalidatePath("/dashboard");
		revalidatePath("/dashboard/accounts");

		return {
			success: true,
			extracted: {
				...extracted,
				accountName: account.name,
			},
			transaction: {
				id: result.created.id,
				amount: result.created.monto.toNumber(),
				type: extracted.type,
				category: result.created.categoria,
				description: result.created.comercio,
				accountName: account.name,
				date: result.created.createdAt.toISOString(),
				accountBalance: result.updatedAccount.balance.toNumber(),
			},
		};
	} catch (error) {
		console.error("processFinancialPrompt:", error);
		const detail =
			error instanceof Error ? error.message : "Error desconocido";
		return {
			success: false,
			error: `No se pudo procesar el mensaje. ${detail}`,
		};
	}
}
