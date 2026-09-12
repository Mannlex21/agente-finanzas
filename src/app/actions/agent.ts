"use server";

import { generateObject } from "ai";
import { prisma } from "@/lib/prisma";
import { getAIModel } from "@/lib/ai/model";
import {
	multiActionSchema,
	ProcessedAccount,
	ProcessedBudget,
	ProcessedTransaction,
} from "@/lib/schemas/agent";
import { AccountType, TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function processFinancialPrompt(prompt: string) {
	try {
		const model = getAIModel("google");

		// 1. Extraer todas las intenciones presentes en el mensaje del usuario
		const { object } = await generateObject({
			model,
			schema: multiActionSchema,
			system: `Eres un asistente de finanzas personales. Analiza la solicitud del usuario e identifica TODAS las acciones descritas (pueden ser múltiples transacciones, presupuestos o cuentas). 
Devuelve cada acción dentro del arreglo 'actions'.`,
			prompt,
		});

		if (!object.actions || object.actions.length === 0) {
			return {
				success: false,
				error: "No se identificó ninguna acción válida en tu mensaje.",
			};
		}

		const results: Array<
			| { type: "transaction"; data: ProcessedTransaction }
			| { type: "budget"; data: ProcessedBudget }
			| { type: "account"; data: ProcessedAccount }
		> = [];

		// 2. Procesar cada acción secuencialmente
		for (const action of object.actions) {
			// --- ACCIÓN: REGISTRAR TRANSACCIÓN ---
			if (
				action.intent === "create_transaction" &&
				action.transactionData
			) {
				const txData = action.transactionData;

				const account = await prisma.financialAccount.findFirst({
					where: {
						name: {
							contains: txData.accountName,
							mode: "insensitive",
						},
					},
				});

				if (!account) {
					return {
						success: false,
						error: `No se encontró la cuenta "${txData.accountName}". Crea la cuenta primero.`,
					};
				}

				const isExpense = txData.tipo === "gasto";
				const amount = txData.monto;
				const isCreditCard = account.type === AccountType.credit_card;

				// Lógica de cálculo: Para crédito, un gasto aumenta la deuda (+); para débito/efectivo, resta saldo (-)
				const currentBalance = account.balance.toNumber();
				const newBalance = isCreditCard
					? isExpense
						? currentBalance + amount
						: currentBalance - amount
					: isExpense
						? currentBalance - amount
						: currentBalance + amount;

				const [createdTx, updatedAccount] = await prisma.$transaction([
					prisma.transaction.create({
						data: {
							comercio: txData.comercio,
							monto: amount,
							categoria: txData.categoria,
							tipo: isExpense
								? TransactionType.gasto
								: TransactionType.ingreso,
							accountId: account.id,
						},
					}),
					prisma.financialAccount.update({
						where: { id: account.id },
						data: { balance: newBalance },
					}),
				]);

				results.push({
					type: "transaction",
					data: {
						id: createdTx.id,
						amount: createdTx.monto.toNumber(),
						type: isExpense ? "expense" : "income",
						category: createdTx.categoria,
						description: createdTx.comercio,
						accountName: updatedAccount.name,
						date: createdTx.createdAt.toISOString(),
						accountBalance: updatedAccount.balance.toNumber(),
					},
				});
			}

			// --- ACCIÓN: CREAR PRESUPUESTO ---
			else if (action.intent === "create_budget" && action.budgetData) {
				const bData = action.budgetData;

				if (!bData.limite) {
					return {
						success: false,
						error: `Por favor especifica un límite para el presupuesto de ${bData.categoria}.`,
					};
				}

				const budget = await prisma.budget.upsert({
					where: { categoria: bData.categoria },
					update: { limite: bData.limite },
					create: {
						categoria: bData.categoria,
						limite: bData.limite,
					},
				});

				results.push({
					type: "budget",
					data: {
						id: budget.id,
						categoria: budget.categoria,
						limite: budget.limite.toNumber(),
						category: budget.categoria,
						limit: budget.limite.toNumber(),
					},
				});
			}

			// --- ACCIÓN: CREAR CUENTA ---
			else if (action.intent === "create_account" && action.accountData) {
				const accData = action.accountData;

				if (accData.type === "credit_card") {
					if (!accData.cutoffDay || !accData.paymentDueDate) {
						return {
							success: false,
							error: `Para registrar la tarjeta "${accData.name}", especifica el día de corte y el día límite de pago.`,
						};
					}
				}

				const initialBalance = accData.balance ?? 0;
				const creditLimit =
					accData.creditLimit ??
					(accData.type === "credit_card"
						? accData.balance
						: undefined);

				const account = await prisma.financialAccount.create({
					data: {
						name: accData.name,
						type: accData.type as AccountType,
						balance: initialBalance,
						creditLimit: creditLimit,
						cutoffDay: accData.cutoffDay,
						paymentDueDate: accData.paymentDueDate,
					},
				});

				const mappedAccountType = (
					["bank", "credit_card", "cash", "investment"].includes(
						account.type,
					)
						? account.type
						: "bank"
				) as ProcessedAccount["type"];

				results.push({
					type: "account",
					data: {
						id: account.id,
						name: account.name,
						type: mappedAccountType,
						balance: account.balance.toNumber(),
						creditLimit:
							account.creditLimit?.toNumber() ?? undefined,
						cutoffDay: account.cutoffDay ?? undefined,
						paymentDueDate: account.paymentDueDate ?? undefined,
						limiteCredito:
							account.creditLimit?.toNumber() ?? undefined,
						cierre: account.cutoffDay ?? undefined,
						limitePago: account.paymentDueDate ?? undefined,
					},
				});
			}
		}

		revalidatePath("/dashboard");
		revalidatePath("/dashboard/accounts");

		return {
			success: true,
			message: `Se procesaron ${results.length} acción(es) correctamente.`,
			results,
		};
	} catch (error) {
		console.error("Error en processFinancialPrompt:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Ocurrió un error inesperado al procesar la solicitud.",
		};
	}
}
