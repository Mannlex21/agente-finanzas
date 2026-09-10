"use client";

import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useCallback,
} from "react";
import { FinancialAccount } from "../types/finance";
import { AccountService } from "../services/accountService";

interface AccountContextData {
	accounts: FinancialAccount[];
	loading: boolean;
	addOrUpdateAccount: (account: FinancialAccount) => void;
	removeAccount: (id: string) => void;
	refreshAccounts: () => void;
}

const AccountContext = createContext<AccountContextData>(
	{} as AccountContextData,
);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
	// Inicialización perezosa: lee localStorage directamente al montar sin necesidad de useEffect
	const [accounts, setAccounts] = useState<FinancialAccount[]>(() => {
		return AccountService.getAccounts();
	});
	const [loading, setLoading] = useState<boolean>(false);

	const refreshAccounts = useCallback(() => {
		setLoading(true);
		try {
			const data = AccountService.getAccounts();
			setAccounts(data);
		} catch (error) {
			console.error("Error refreshing accounts:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	const addOrUpdateAccount = (account: FinancialAccount) => {
		const updated = AccountService.saveAccount(account);
		setAccounts(updated);
	};

	const removeAccount = (id: string) => {
		const updated = AccountService.deleteAccount(id);
		setAccounts(updated);
	};

	return (
		<AccountContext.Provider
			value={{
				accounts,
				loading,
				addOrUpdateAccount,
				removeAccount,
				refreshAccounts,
			}}
		>
			{children}
		</AccountContext.Provider>
	);
};

export const useAccounts = () => useContext(AccountContext);
