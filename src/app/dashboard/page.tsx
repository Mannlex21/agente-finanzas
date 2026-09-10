import React from "react";
import { prisma } from "@/lib/prisma";
import { AccountType } from "@prisma/client";
import { Wallet, CreditCard, DollarSign, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardOverviewPage() {
	// Consulta directa a Supabase mediante Prisma
	const accounts = await prisma.financialAccount.findMany({
		orderBy: { createdAt: "desc" },
	});

	// Calcular métricas financieras en el servidor usando Decimal a Number
	const totalBalance = accounts
		.filter((acc) => acc.type !== AccountType.credit_card)
		.reduce((acc, curr) => acc + curr.balance.toNumber(), 0);

	const totalCreditLimit = accounts
		.filter((acc) => acc.type === AccountType.credit_card)
		.reduce(
			(acc, curr) =>
				acc + (curr.creditLimit ? curr.creditLimit.toNumber() : 0),
			0,
		);

	const creditCardsCount = accounts.filter(
		(acc) => acc.type === AccountType.credit_card,
	).length;

	const debitCardsCount = accounts.filter(
		(acc) => acc.type !== AccountType.credit_card,
	).length;

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			{/* Encabezado */}
			<div>
				<h1 className="text-2xl font-bold text-white tracking-tight">
					Project Overview
				</h1>
				<p className="text-sm text-gray-400 mt-1">
					Estado general de tus finanzas y cuentas activas.
				</p>
			</div>

			{/* Tarjetas de Métricas Estilo Supabase */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
				<div className="bg-[#17171a] border border-gray-800 rounded-xl p-5 flex flex-col justify-between shadow-sm">
					<div className="flex justify-between items-start">
						<span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
							Saldo Líquido Total
						</span>
						<div className="p-2 bg-emerald-950/50 text-emerald-400 rounded-lg border border-emerald-900/50">
							<DollarSign size={18} />
						</div>
					</div>
					<div className="mt-4">
						<div className="text-2xl font-bold text-white">
							${totalBalance.toFixed(2)}
						</div>
						<div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
							<ArrowUpRight size={14} /> Efectivo y cuentas de
							débito/ahorro
						</div>
					</div>
				</div>

				<div className="bg-[#17171a] border border-gray-800 rounded-xl p-5 flex flex-col justify-between shadow-sm">
					<div className="flex justify-between items-start">
						<span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
							Límite de Crédito
						</span>
						<div className="p-2 bg-purple-950/50 text-purple-400 rounded-lg border border-purple-900/50">
							<CreditCard size={18} />
						</div>
					</div>
					<div className="mt-4">
						<div className="text-2xl font-bold text-white">
							${totalCreditLimit.toFixed(2)}
						</div>
						<div className="text-xs text-gray-400 mt-1">
							Asignado en {creditCardsCount} tarjetas de crédito
						</div>
					</div>
				</div>

				<div className="bg-[#17171a] border border-gray-800 rounded-xl p-5 flex flex-col justify-between shadow-sm">
					<div className="flex justify-between items-start">
						<span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
							Cuentas Registradas
						</span>
						<div className="p-2 bg-blue-950/50 text-blue-400 rounded-lg border border-blue-900/50">
							<Wallet size={18} />
						</div>
					</div>
					<div className="mt-4">
						<div className="text-2xl font-bold text-white">
							{accounts.length}
						</div>
						<div className="text-xs text-gray-400 mt-1">
							{debitCardsCount} débito/efectivo,{" "}
							{creditCardsCount} crédito
						</div>
					</div>
				</div>
			</div>

			{/* Panel de Accesos Rápidos */}
			<div className="bg-[#17171a] border border-gray-800 rounded-xl p-6">
				<h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
					Módulos del Sistema
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					<Link
						href="/dashboard/accounts"
						className="p-4 bg-[#1f1f23] hover:bg-[#27272a] border border-gray-800 rounded-lg transition group"
					>
						<div className="font-medium text-white group-hover:text-emerald-400 text-sm">
							Administrar Cuentas
						</div>
						<div className="text-xs text-gray-400 mt-1">
							Ver listado, agregar o eliminar tarjetas y saldos.
						</div>
					</Link>
					<div className="p-4 bg-[#1f1f23] border border-gray-800 rounded-lg opacity-60 cursor-not-allowed">
						<div className="font-medium text-white text-sm">
							Transacciones (Próximamente)
						</div>
						<div className="text-xs text-gray-400 mt-1">
							Registro de gastos e ingresos por categoría.
						</div>
					</div>
					<div className="p-4 bg-[#1f1f23] border border-gray-800 rounded-lg opacity-60 cursor-not-allowed">
						<div className="font-medium text-white text-sm">
							Presupuestos y Cortes
						</div>
						<div className="text-xs text-gray-400 mt-1">
							Control de fechas de corte de tarjetas.
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
