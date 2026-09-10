"use client";

import React, { useState } from "react";
import {
	PieChart,
	Plus,
	AlertTriangle,
	TrendingUp,
	Trash2,
} from "lucide-react";

interface BudgetCategory {
	id: string;
	categoria: string;
	gastado: number;
	limite: number;
	color: string; // Color para la barra de progreso
}

export default function BudgetsPage() {
	// Estado mock de presupuestos por categoría
	const [budgets, setBudgets] = useState<BudgetCategory[]>([
		{
			id: "1",
			categoria: "Supermercado y Despensa",
			gastado: 3850.0,
			limite: 5000.0,
			color: "bg-emerald-500",
		},
		{
			id: "2",
			categoria: "Entretenimiento y Salidas",
			gastado: 2100.0,
			limite: 2000.0, // Superado a propósito para mostrar alerta
			color: "bg-amber-500",
		},
		{
			id: "3",
			categoria: "Servicios (Luz, Agua, Internet)",
			gastado: 1200.0,
			limite: 2500.0,
			color: "bg-blue-500",
		},
	]);

	const handleDelete = (id: string) => {
		setBudgets(budgets.filter((b) => b.id !== id));
	};

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			{/* Encabezado Principal */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#17171a] border border-gray-800 rounded-xl p-6 shadow-sm">
				<div className="flex items-center gap-4">
					<div className="p-3 bg-purple-950/50 text-purple-400 rounded-xl border border-purple-900/50">
						<PieChart size={24} />
					</div>
					<div>
						<h1 className="text-xl font-bold text-white tracking-tight">
							Control de Presupuestos
						</h1>
						<p className="text-xs text-gray-400 mt-0.5">
							Monitorea tus límites de gasto mensuales por
							categoría en tiempo real.
						</p>
					</div>
				</div>
				<button
					onClick={() =>
						alert(
							"Modal para agregar nuevo presupuesto próximamente",
						)
					}
					className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-black font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
				>
					<Plus size={16} />
					Nuevo Presupuesto
				</button>
			</div>

			{/* Grid de Presupuestos */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{budgets.map((item) => {
					const porcentaje = Math.min(
						Math.round((item.gastado / item.limite) * 100),
						100,
					);
					const isOverBudget = item.gastado > item.limite;

					return (
						<div
							key={item.id}
							className="bg-[#17171a] border border-gray-800 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-6 hover:border-gray-700 transition"
						>
							<div>
								<div className="flex justify-between items-start mb-4">
									<div>
										<h3 className="font-semibold text-white text-sm">
											{item.categoria}
										</h3>
										<span className="text-[10px] text-gray-400 uppercase tracking-wider">
											Límite Mensual
										</span>
									</div>
									<button
										onClick={() => handleDelete(item.id)}
										className="text-gray-500 hover:text-red-400 transition p-1"
									>
										<Trash2 size={16} />
									</button>
								</div>

								{/* Montos */}
								<div className="flex justify-between items-baseline mb-2">
									<div>
										<span className="text-2xl font-bold text-white">
											${item.gastado.toFixed(2)}
										</span>
										<span className="text-xs text-gray-400 ml-1.5">
											/ ${item.limite.toFixed(2)}
										</span>
									</div>
									<span
										className={`text-xs font-semibold px-2 py-0.5 rounded border ${
											isOverBudget
												? "bg-red-950/50 text-red-400 border-red-900/50"
												: "bg-emerald-950/50 text-emerald-400 border-emerald-900/50"
										}`}
									>
										{porcentaje}%
									</span>
								</div>

								{/* Barra de Progreso */}
								<div className="w-full bg-[#1f1f23] rounded-full h-2.5 overflow-hidden border border-gray-800">
									<div
										className={`h-2.5 rounded-full transition-all duration-500 ${
											isOverBudget
												? "bg-red-500"
												: item.color
										}`}
										style={{
											width: `${Math.min((item.gastado / item.limite) * 100, 100)}%`,
										}}
									/>
								</div>
							</div>

							{/* Alerta si excede el presupuesto */}
							{isOverBudget && (
								<div className="bg-red-950/30 border border-red-900/50 p-2.5 rounded-lg text-red-300 text-xs flex items-center gap-2">
									<AlertTriangle
										size={15}
										className="shrink-0"
									/>
									<span>
										Has superado el límite de este
										presupuesto por $
										{(item.gastado - item.limite).toFixed(
											2,
										)}
										.
									</span>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
