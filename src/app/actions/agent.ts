"use server";

import { generateObject } from "ai";
import { revalidatePath } from "next/cache";
import { AccountType, TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAIModel } from "@/lib/ai/model";
import { z } from "zod";
import {
	createAccountSchema,
	createBudgetSchema,
	createTransactionSchema,
	ProcessedTransaction,
	ProcessFinancialPromptResult,
} from "@/lib/schemas/agent";

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

function mapPrismaType(tipo: "gasto" | "ingreso"): TransactionType {
	return tipo === "ingreso" ? TransactionType.ingreso : TransactionType.gasto;
}

function balanceDelta(
	accountType: AccountType,
	tipo: "gasto" | "ingreso",
	amount: number,
): number {
	const isIncome = tipo === "ingreso";

	if (accountType === AccountType.credit_card) {
		// En TC: Un gasto AUMENTA la deuda (+amount), un pago/ingreso DISMINUYE la deuda (-amount)
		return isIncome ? -amount : amount;
	}

	// En Cuentas Débito/Efectivo: Un ingreso SUMA (+amount), un gasto RESTA (-amount)
	return isIncome ? amount : -amount;
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

	const accountNames = accounts.map((a) => a.name);

	try {
		const { object } = await generateObject({
			model: getAIModel(),
			schema: z.object({
				intent: z
					.enum([
						"create_transaction",
						"create_budget",
						"create_account",
					])
					.describe("Intención detectada en el mensaje del usuario"),
				transactionData: createTransactionSchema
					.optional()
					.describe(
						"Datos extraídos si la intención es registrar una transacción",
					),
				budgetData: createBudgetSchema
					.optional()
					.describe(
						"Datos extraídos si la intención es asignar un presupuesto",
					),
				accountData: createAccountSchema
					.optional()
					.describe(
						"Datos extraídos si la intención es registrar una nueva cuenta",
					),
			}),
			temperature: 0,
			system: `Eres un agente experto de finanzas personales. Analiza la intención del usuario para mapearla a uno de estos 3 dominios:
- create_transaction: Para registrar gastos o ingresos ("Gasté $350...", "Recibí un pago de $1200...", "Registra un gasto de...").
- create_budget: Para fijar límites o presupuestos mensuales por categoría ("Pon un presupuesto de $5000 para Alimentación...", "Fija un límite de...").
- create_account: Para registrar una nueva cuenta o tarjeta ("Crea una cuenta llamada Efectivo con saldo $500...", "Registra mi tarjeta Santander con $0 de saldo...").

Cuentas actuales disponibles para transacciones:
${accountNames.map((n) => `- ${n}`).join("\n")}

Reglas críticas:
1. Extrae siempre con precisión los montos numéricos.
2. Si se trata de create_transaction y no se especifica una cuenta, asume la primera cuenta disponible en la lista si existe.
3. Para create_budget, asegúrate de normalizar la categoría de forma corta.
4. Para create_account, clasifica el tipo correctamente en "debit_card", "credit_card", "cash" o "savings".`,
			prompt,
		});

		const { intent, transactionData, budgetData, accountData } = object;

		if (intent === "create_transaction" && transactionData) {
			if (accounts.length === 0) {
				return {
					success: false,
					error: "No hay cuentas registradas. Crea una cuenta antes de registrar transacciones.",
				};
			}

			const account =
				resolveAccount(accounts, transactionData.accountName) ||
				accounts[0];
			if (!account) {
				return {
					success: false,
					error: "No se encontró ninguna cuenta financiera válida disponible.",
				};
			}

			const amount = transactionData.monto;
			const tipo = transactionData.tipo;
			const delta = balanceDelta(account.type, tipo, amount);

			const result = await prisma.$transaction(async (tx) => {
				const created = await tx.transaction.create({
					data: {
						comercio: transactionData.comercio,
						monto: amount,
						categoria: transactionData.categoria,
						tipo: mapPrismaType(tipo),
						accountId: account.id,
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
			revalidatePath("/dashboard/transactions");
			revalidatePath("/dashboard/budgets");

			const processed: ProcessedTransaction = {
				id: result.created.id,
				amount: result.created.monto.toNumber(),
				type: tipo === "ingreso" ? "income" : "expense",
				category: result.created.categoria,
				description: result.created.comercio,
				accountName: account.name,
				date: result.created.createdAt.toISOString(),
				accountBalance: result.updatedAccount.balance.toNumber(),
			};

			return {
				success: true,
				type: "transaction",
				message: `Transacción registrada: Gasto/Ingreso de $${amount} en la cuenta ${account.name} bajo la categoría "${transactionData.categoria}".`,
				data: processed,
			};
		}

		if (intent === "create_budget" && budgetData) {
			if (!budgetData.limite || budgetData.limite <= 0) {
				return {
					success: false,
					error: `Por favor, especifica el monto límite para el presupuesto de "${budgetData.categoria}". (Ejemplo: "Crear presupuesto de $1500 para ${budgetData.categoria}")`,
				};
			}

			const budget = await prisma.budget.upsert({
				where: { categoria: budgetData.categoria },
				update: { limite: budgetData.limite },
				create: {
					categoria: budgetData.categoria,
					limite: budgetData.limite,
				},
			});

			revalidatePath("/dashboard");
			revalidatePath("/dashboard/budgets");

			return {
				success: true,
				type: "budget",
				message: `Presupuesto asignado: Categoría "${budget.categoria}" con un límite de $${budget.limite.toNumber()}.`,
				data: {
					id: budget.id,
					categoria: budget.categoria,
					limite: budget.limite.toNumber(),
				},
			};
		}

		if (intent === "create_account" && accountData) {
			if (accountData.type === "credit_card") {
				if (!accountData.cutoffDay || !accountData.paymentDueDate) {
					return {
						success: false,
						error: `Para registrar tu tarjeta de crédito "${accountData.name}", por favor especifica el día de corte y el día límite de pago.`,
					};
				}
			}

			const initialBalance =
				accountData.type === "credit_card" ? 0 : accountData.balance;
			const creditLimit =
				accountData.creditLimit ??
				(accountData.type === "credit_card"
					? accountData.balance
					: undefined);

			const account = await prisma.financialAccount.create({
				data: {
					name: accountData.name,
					type: accountData.type as AccountType,
					balance: initialBalance,
					creditLimit: creditLimit,
					cutoffDay: accountData.cutoffDay,
					paymentDueDate: accountData.paymentDueDate,
				},
			});

			revalidatePath("/dashboard");
			revalidatePath("/dashboard/accounts");
			console.log(account);
			return {
				success: true,
				type: "account",
				message: `Cuenta registrada: "${account.name}" con límite de $${creditLimit || 0}.`,
				data: {
					id: account.id,
					name: account.name,
					type: account.type,
					balance: account.balance.toNumber(),
					creditLimit: account.creditLimit
						? account.creditLimit.toNumber()
						: null,
					cutoffDay: account.cutoffDay,
					paymentDueDate: account.paymentDueDate,
				},
			};
		}

		return {
			success: false,
			error: "No se pudo interpretar el comando financiero correctamente.",
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
