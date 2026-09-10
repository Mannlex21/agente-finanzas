"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AccountType } from "@prisma/client";

export interface CreateAccountInput {
	name: string;
	type: AccountType;
	currency: string;
	balance?: number;
	creditLimit?: number;
	cutoffDay?: number;
	paymentDueDate?: number;
}

export async function createAccountAction(data: CreateAccountInput) {
	await prisma.financialAccount.create({
		data: {
			name: data.name,
			type: data.type,
			currency: data.currency,
			balance: data.type !== "credit_card" ? data.balance || 0 : 0,
			creditLimit:
				data.type === "credit_card" ? data.creditLimit || 0 : null,
			cutoffDay:
				data.type === "credit_card" ? data.cutoffDay || null : null,
			paymentDueDate:
				data.type === "credit_card"
					? data.paymentDueDate || null
					: null,
		},
	});

	revalidatePath("/cuentas");
}
