"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function getBudgets() {
	try {
		const budgets = await prisma.budget.findMany({
			orderBy: {
				categoria: "asc",
			},
		});

		// Calculate spent from real transactions under that category
		const transactions = await prisma.transaction.findMany({
			where: {
				tipo: TransactionType.gasto,
			},
			select: {
				categoria: true,
				monto: true,
			},
		});

		const spentMap: Record<string, number> = {};
		for (const tx of transactions) {
			const cat = tx.categoria;
			const amount = tx.monto.toNumber();
			spentMap[cat] = (spentMap[cat] || 0) + amount;
		}

		return {
			success: true,
			data: budgets.map((b) => ({
				id: b.id,
				categoria: b.categoria,
				limite: b.limite.toNumber(),
				gastado: spentMap[b.categoria] || 0,
			})),
		};
	} catch (error) {
		console.error("Error in getBudgets:", error);
		return {
			success: false,
			error: "No se pudieron obtener los presupuestos.",
		};
	}
}

interface CreateBudgetInput {
	categoria: string;
	limite: number;
}

export async function createBudget(data: CreateBudgetInput) {
	try {
		const { categoria, limite } = data;

		if (!categoria.trim() || limite <= 0) {
			return { success: false, error: "Datos de presupuesto inválidos." };
		}

		// Check if a budget already exists for this category
		const existing = await prisma.budget.findUnique({
			where: { categoria: categoria.trim() },
		});

		if (existing) {
			return {
				success: false,
				error: `Ya existe un presupuesto para la categoría "${categoria}".`,
			};
		}

		await prisma.budget.create({
			data: {
				categoria: categoria.trim(),
				limite,
			},
		});

		revalidatePath("/dashboard/budgets");
		revalidatePath("/dashboard");

		return { success: true };
	} catch (error) {
		console.error("Error in createBudget:", error);
		return { success: false, error: "No se pudo crear el presupuesto." };
	}
}

interface UpdateBudgetInput {
	categoria: string;
	limite: number;
}

export async function updateBudget(id: string, data: UpdateBudgetInput) {
	try {
		const { categoria, limite } = data;

		if (!categoria.trim() || limite <= 0) {
			return { success: false, error: "Datos de presupuesto inválidos." };
		}

		// Check if category exists for another budget
		const existingCategory = await prisma.budget.findFirst({
			where: {
				categoria: categoria.trim(),
				NOT: { id },
			},
		});

		if (existingCategory) {
			return {
				success: false,
				error: `Ya existe otro presupuesto para la categoría "${categoria}".`,
			};
		}

		await prisma.budget.update({
			where: { id },
			data: {
				categoria: categoria.trim(),
				limite,
			},
		});

		revalidatePath("/dashboard/budgets");
		revalidatePath("/dashboard");

		return { success: true };
	} catch (error) {
		console.error("Error in updateBudget:", error);
		return {
			success: false,
			error: "No se pudo actualizar el presupuesto.",
		};
	}
}

export async function deleteBudget(id: string) {
	try {
		await prisma.budget.delete({
			where: { id },
		});

		revalidatePath("/dashboard/budgets");
		revalidatePath("/dashboard");

		return { success: true };
	} catch (error) {
		console.error("Error in deleteBudget:", error);
		return { success: false, error: "No se pudo eliminar el presupuesto." };
	}
}
