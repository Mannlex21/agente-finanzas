import React from "react";
import { getTransactions, getAccounts } from "@/app/actions/transactions";
import { TransactionsList } from "./TransactionsList";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
	const [txResult, accResult] = await Promise.all([
		getTransactions(),
		getAccounts(),
	]);

	const transactions = txResult.success && txResult.data ? txResult.data : [];
	const accounts = accResult.success && accResult.data ? accResult.data : [];

	// Map transactions to correct types if needed (e.g., cast 'gasto' | 'ingreso')
	const typedTransactions = transactions.map((tx) => ({
		...tx,
		tipo: tx.tipo === "ingreso" ? ("ingreso" as const) : ("gasto" as const),
	}));

	return (
		<TransactionsList
			initialTransactions={typedTransactions}
			accounts={accounts}
		/>
	);
}
