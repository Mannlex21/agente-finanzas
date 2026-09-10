import { FinancialAccount } from "../types/finance";

const STORAGE_KEY = "agente_finanzas_accounts";

export const AccountService = {
	getAccounts(): FinancialAccount[] {
		if (typeof window === "undefined") return [];
		try {
			const data = localStorage.getItem(STORAGE_KEY);
			return data ? JSON.parse(data) : [];
		} catch (error) {
			console.error("Error fetching accounts:", error);
			return [];
		}
	},

	saveAccount(account: FinancialAccount): FinancialAccount[] {
		const accounts = this.getAccounts();
		const existingIndex = accounts.findIndex((a) => a.id === account.id);

		let updatedAccounts: FinancialAccount[];
		if (existingIndex >= 0) {
			updatedAccounts = accounts.map((a) =>
				a.id === account.id ? account : a,
			);
		} else {
			updatedAccounts = [
				...accounts,
				{ ...account, id: Date.now().toString() },
			];
		}

		localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
		return updatedAccounts;
	},

	deleteAccount(id: string): FinancialAccount[] {
		const accounts = this.getAccounts();
		const updatedAccounts = accounts.filter((a) => a.id !== id);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
		return updatedAccounts;
	},
};
