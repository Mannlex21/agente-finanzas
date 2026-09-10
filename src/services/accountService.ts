import { prisma } from "@/lib/prisma";
import { FinancialAccount as AccountTypeTS } from "@/types/finance";

export const AccountService = {
	// Obtener todas las cuentas
	async getAccounts(): Promise<AccountTypeTS[]> {
		const accounts = await prisma.financialAccount.findMany({
			orderBy: { createdAt: "desc" },
		});

		return accounts.map((acc) => ({
			id: acc.id,
			name: acc.name,
			type: acc.type as AccountTypeTS["type"],
			balance: Number(acc.balance),
			creditLimit: acc.creditLimit ? Number(acc.creditLimit) : undefined,
			cutoffDay: acc.cutoffDay ?? undefined,
			paymentDueDate: acc.paymentDueDate ?? undefined,
			currency: acc.currency,
		}));
	},

	// Guardar o actualizar cuenta
	async saveAccount(account: Omit<AccountTypeTS, "id"> & { id?: string }) {
		if (account.id) {
			return await prisma.financialAccount.update({
				where: { id: account.id },
				data: {
					name: account.name,
					type: account.type,
					balance: account.balance,
					creditLimit: account.creditLimit,
					cutoffDay: account.cutoffDay,
					paymentDueDate: account.paymentDueDate,
					currency: account.currency,
				},
			});
		}

		return await prisma.financialAccount.create({
			data: {
				name: account.name,
				type: account.type,
				balance: account.balance,
				creditLimit: account.creditLimit,
				cutoffDay: account.cutoffDay,
				paymentDueDate: account.paymentDueDate,
				currency: account.currency || "MXN",
			},
		});
	},

	// Eliminar cuenta
	async deleteAccount(id: string) {
		return await prisma.financialAccount.delete({
			where: { id },
		});
	},
};
