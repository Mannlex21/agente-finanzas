import React from "react";
import { getBudgets } from "@/app/actions/budgets";
import { BudgetsList } from "./BudgetsList";

export const dynamic = "force-dynamic";

export default async function BudgetsPage() {
	const result = await getBudgets();
	const budgets = result.success && result.data ? result.data : [];

	return <BudgetsList initialBudgets={budgets} />;
}
