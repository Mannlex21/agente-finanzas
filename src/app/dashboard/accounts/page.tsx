import React from "react";
import { prisma } from "@/lib/prisma";
import { AccountsHeader } from "@/app/components/AccountsHeader";
import { AccountsList } from "@/app/components/AccountsList";
import { revalidatePath } from "next/cache";

// Server Action para eliminar cuentas desde el cliente
async function deleteAccountAction(id: string) {
	"use server";
	await prisma.financialAccount.delete({
		where: { id },
	});
	revalidatePath("/cuentas");
}

export default async function AccountsPage() {
	// Consulta directa a la base de datos PostgreSQL en Supabase
	const rawAccounts = await prisma.financialAccount.findMany({
		orderBy: { createdAt: "desc" },
	});

	// Mapeo para serializar tipos Decimal a número para React Client Components
	const accounts = rawAccounts.map((acc) => ({
		...acc,
		balance: acc.balance.toNumber(),
		creditLimit: acc.creditLimit ? acc.creditLimit.toNumber() : null,
	}));

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			{/* Encabezado e interacciones de cliente (Modal) */}
			<AccountsHeader />

			{/* Lista de cuentas en la base de datos */}
			<div className="bg-[#17171a] border border-gray-800 rounded-xl p-6 shadow-sm">
				<AccountsList
					accounts={accounts}
					deleteAccountAction={deleteAccountAction}
				/>
			</div>
		</div>
	);
}
