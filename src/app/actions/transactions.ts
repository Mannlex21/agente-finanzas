"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TransactionType, AccountType } from "@prisma/client";

// Get all transactions ordered by date descending
export async function getTransactions() {
	try {
		const transactions = await prisma.transaction.findMany({
			include: {
				account: {
					select: {
						id: true,
						name: true,
						type: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return {
			success: true,
			data: transactions.map((tx) => ({
				id: tx.id,
				comercio: tx.comercio,
				monto: tx.monto.toNumber(),
				categoria: tx.categoria,
				tipo: tx.tipo,
				accountId: tx.accountId,
				accountName: tx.account.name,
				fecha: tx.createdAt.toISOString(),
			})),
		};
	} catch (error) {
		console.error("Error in getTransactions:", error);
		return {
			success: false,
			error: "No se pudieron obtener las transacciones.",
		};
	}
}

// Get accounts available for registration
export async function getAccounts() {
	try {
		const accounts = await prisma.financialAccount.findMany({
			select: {
				id: true,
				name: true,
				type: true,
				balance: true,
			},
			orderBy: {
				name: "asc",
			},
		});

		return {
			success: true,
			data: accounts.map((acc) => ({
				id: acc.id,
				name: acc.name,
				type: acc.type,
				balance: acc.balance.toNumber(),
			})),
		};
	} catch (error) {
		console.error("Error in getAccounts:", error);
		return { success: false, error: "No se pudieron obtener las cuentas." };
	}
}

interface CreateTransactionInput {
	comercio: string;
	monto: number;
	categoria: string;
	tipo: "gasto" | "ingreso";
	accountId: string;
	createdAt?: string;
}

// Helper to calculate balance delta
function calculateBalanceDelta(
	accountType: AccountType,
	type: "gasto" | "ingreso",
	amount: number,
): number {
	const isIncome = type === "ingreso";
	if (accountType === AccountType.credit_card) {
		return isIncome ? -amount : amount;
	}
	return isIncome ? amount : -amount;
}

// Create transaction and update account balance atomically
export async function createTransaction(data: CreateTransactionInput) {
	try {
		const { comercio, monto, categoria, tipo, accountId, createdAt } = data;

		if (!comercio.trim() || monto <= 0 || !categoria.trim() || !accountId) {
			return { success: false, error: "Datos de transacción inválidos." };
		}

		const account = await prisma.financialAccount.findUnique({
			where: { id: accountId },
		});

		if (!account) {
			return {
				success: false,
				error: "La cuenta seleccionada no existe.",
			};
		}

		const delta = calculateBalanceDelta(account.type, tipo, monto);
		const parsedDate = createdAt ? new Date(createdAt) : new Date();

		await prisma.$transaction(async (tx) => {
			await tx.transaction.create({
				data: {
					comercio,
					monto,
					categoria,
					tipo:
						tipo === "ingreso"
							? TransactionType.ingreso
							: TransactionType.gasto,
					accountId,
					createdAt: parsedDate,
				},
			});

			await tx.financialAccount.update({
				where: { id: accountId },
				data: {
					balance: {
						increment: delta,
					},
				},
			});
		});

		revalidatePath("/dashboard/transactions");
		revalidatePath("/dashboard/accounts");
		revalidatePath("/dashboard");

		return { success: true };
	} catch (error) {
		console.error("Error in createTransaction:", error);
		return { success: false, error: "No se pudo crear la transacción." };
	}
}

// Delete transaction and revert account balance atomically
export async function deleteTransaction(id: string) {
	try {
		const transaction = await prisma.transaction.findUnique({
			where: { id },
			include: { account: true },
		});

		if (!transaction) {
			return { success: false, error: "La transacción no existe." };
		}

		// Reverting means using negative delta
		const amount = transaction.monto.toNumber();
		const originalType =
			transaction.tipo === TransactionType.ingreso ? "ingreso" : "gasto";
		const delta = calculateBalanceDelta(
			transaction.account.type,
			originalType,
			amount,
		);

		await prisma.$transaction(async (tx) => {
			await tx.transaction.delete({
				where: { id },
			});

			await tx.financialAccount.update({
				where: { id: transaction.accountId },
				data: {
					balance: {
						decrement: delta, // Subtract delta to revert
					},
				},
			});
		});

		revalidatePath("/dashboard/transactions");
		revalidatePath("/dashboard/accounts");
		revalidatePath("/dashboard");

		return { success: true };
	} catch (error) {
		console.error("Error in deleteTransaction:", error);
		return { success: false, error: "No se pudo eliminar la transacción." };
	}
}
