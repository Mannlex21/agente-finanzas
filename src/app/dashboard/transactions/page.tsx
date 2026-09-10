"use client";

import React, { useState } from "react";
import {
	Wallet,
	Plus,
	ArrowUpRight,
	ArrowDownLeft,
	Search,
	Filter,
	Trash2,
} from "lucide-react";

// Tipo de ejemplo para las transacciones (puedes adaptarlo a tu schema definitivo)
interface TransactionItem {
	id: string;
	comercio: string;
	monto: number;
	categoria: string;
	tipo: "gasto" | "ingreso";
	cuenta: string;
	fecha: string;
}

export default function TransactionsPage() {
	// Estado mock o conectado a tu contexto/API de transacciones
	const [transactions, setTransactions] = useState<TransactionItem[]>([
		{
			id: "1",
			comercio: "Walmart Supercenter",
			monto: 1250.0,
			categoria: "Supermercado",
			tipo: "gasto",
			cuenta: "Tarjeta BBVA",
			fecha: "2026-06-08",
		},
		{
			id: "2",
			comercio: "Nómina Quincenal",
			monto: 15400.0,
			categoria: "Salario",
			tipo: "ingreso",
			cuenta: "Cuenta Nómina",
			fecha: "2026-06-07",
		},
	]);

	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState<"todos" | "gasto" | "ingreso">(
		"todos",
	);

	const filteredTransactions = transactions.filter((tx) => {
		const matchesSearch =
			tx.comercio.toLowerCase().includes(searchTerm.toLowerCase()) ||
			tx.categoria.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesType = filterType === "todos" || tx.tipo === filterType;
		return matchesSearch && matchesType;
	});

	const handleDelete = (id: string) => {
		setTransactions(transactions.filter((tx) => tx.id !== id));
	};

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			{/* Encabezado Principal */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#17171a] border border-gray-800 rounded-xl p-6 shadow-sm">
				<div className="flex items-center gap-4">
					<div className="p-3 bg-blue-950/50 text-blue-400 rounded-xl border border-blue-900/50">
						<Wallet size={24} />
					</div>
					<div>
						<h1 className="text-xl font-bold text-white tracking-tight">
							Historial de Transacciones
						</h1>
						<p className="text-xs text-gray-400 mt-0.5">
							Consulta, filtra y administra todos tus ingresos y
							gastos registrados.
						</p>
					</div>
				</div>
				<button
					onClick={() =>
						alert("Aquí puedes abrir tu modal de nueva transacción")
					}
					className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-black font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
				>
					<Plus size={16} />
					Nueva Transacción
				</button>
			</div>

			{/* Filtros y Buscador */}
			<div className="bg-[#17171a] border border-gray-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
				<div className="relative w-full md:w-80">
					<Search
						size={16}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
					/>
					<input
						type="text"
						placeholder="Buscar por comercio o categoría..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-9 pr-4 py-2 bg-[#1f1f23] border border-gray-800 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
					/>
				</div>

				<div className="flex items-center gap-2 w-full md:w-auto">
					<Filter size={14} className="text-gray-400" />
					<span className="text-xs text-gray-400 mr-2">Filtrar:</span>
					{(["todos", "gasto", "ingreso"] as const).map((type) => (
						<button
							key={type}
							onClick={() => setFilterType(type)}
							className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
								filterType === type
									? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50"
									: "bg-[#1f1f23] text-gray-400 border border-gray-800 hover:text-white"
							}`}
						>
							{type}
						</button>
					))}
				</div>
			</div>

			{/* Tabla de Transacciones */}
			<div className="bg-[#17171a] border border-gray-800 rounded-xl shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b border-gray-800 bg-[#141416]/50 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
								<th className="py-3 px-6">
									Comercio / Descripción
								</th>
								<th className="py-3 px-6">Categoría</th>
								<th className="py-3 px-6">Cuenta</th>
								<th className="py-3 px-6">Fecha</th>
								<th className="py-3 px-6 text-right">Monto</th>
								<th className="py-3 px-4 text-center">
									Acciones
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-800 text-xs">
							{filteredTransactions.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className="text-center py-12 text-gray-500"
									>
										No se encontraron transacciones
										registradas.
									</td>
								</tr>
							) : (
								filteredTransactions.map((tx) => {
									const isIncome = tx.tipo === "ingreso";
									return (
										<tr
											key={tx.id}
											className="hover:bg-[#1f1f23]/50 transition"
										>
											<td className="py-4 px-6 flex items-center gap-3">
												<div
													className={`p-2 rounded-lg border ${
														isIncome
															? "bg-emerald-950/50 text-emerald-400 border-emerald-900/50"
															: "bg-red-950/50 text-red-400 border-red-900/50"
													}`}
												>
													{isIncome ? (
														<ArrowDownLeft
															size={16}
														/>
													) : (
														<ArrowUpRight
															size={16}
														/>
													)}
												</div>
												<div>
													<span className="font-medium text-white block">
														{tx.comercio}
													</span>
													<span className="text-[10px] text-gray-400 uppercase">
														{tx.tipo}
													</span>
												</div>
											</td>
											<td className="py-4 px-6 text-gray-300 font-medium">
												{tx.categoria}
											</td>
											<td className="py-4 px-6 text-gray-400">
												{tx.cuenta}
											</td>
											<td className="py-4 px-6 text-gray-400">
												{tx.fecha}
											</td>
											<td
												className={`py-4 px-6 text-right font-bold ${isIncome ? "text-emerald-400" : "text-white"}`}
											>
												{isIncome ? "+" : "-"}$
												{tx.monto.toFixed(2)}
											</td>
											<td className="py-4 px-4 text-center">
												<button
													onClick={() =>
														handleDelete(tx.id)
													}
													className="text-gray-500 hover:text-red-400 transition p-1"
												>
													<Trash2 size={16} />
												</button>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
