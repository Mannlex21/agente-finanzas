"use client";

import React, { useState, useTransition } from "react";
import {
	PieChart,
	Plus,
	AlertTriangle,
	Trash2,
	Edit2,
	Sparkles,
	Loader2,
} from "lucide-react";
import { deleteBudget } from "@/app/actions/budgets";
import { BudgetModal } from "@/app/components/BudgetModal";

interface BudgetCategory {
	id: string;
	categoria: string;
	gastado: number;
	limite: number;
}

interface BudgetsListProps {
	initialBudgets: BudgetCategory[];
}

export function BudgetsList({ initialBudgets }: BudgetsListProps) {
	const [isPending, startTransition] = useTransition();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editData, setEditData] = useState<BudgetCategory | null>(null);

	const handleDelete = (id: string) => {
		if (
			!confirm(
				"¿Estás seguro de que deseas eliminar este presupuesto? Los consumos de transacciones no se alterarán.",
			)
		) {
			return;
		}

		startTransition(async () => {
			const res = await deleteBudget(id);
			if (!res.success) {
				alert(res.error || "Ocurrió un error al eliminar.");
			}
		});
	};

	const openEdit = (budget: BudgetCategory) => {
		setEditData(budget);
		setIsModalOpen(true);
	};

	const openCreate = () => {
		setEditData(null);
		setIsModalOpen(true);
	};

	const formatMoney = (value: number) => {
		return new Intl.NumberFormat("es-MX", {
			style: "currency",
			currency: "MXN",
		}).format(value);
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

				<div className="flex items-center gap-2.5">
					{/* Botón Agente IA */}
					<a
						href="/dashboard/ai-agent"
						className="inline-flex items-center justify-center gap-2 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-800/60 font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
					>
						<Sparkles size={16} className="text-purple-400" />
						Agente IA
					</a>

					{/* Botón Nuevo Presupuesto */}
					<button
						onClick={openCreate}
						className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-black font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
					>
						<Plus size={16} />
						Nuevo Presupuesto
					</button>
				</div>
			</div>

			{/* Grid de Presupuestos */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
				{isPending && (
					<div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-10 rounded-xl">
						<Loader2
							className="animate-spin text-emerald-400"
							size={32}
						/>
					</div>
				)}

				{initialBudgets.length === 0 ? (
					<div className="col-span-full text-center py-16 bg-[#17171a] border border-gray-800 rounded-xl text-gray-500">
						<PieChart
							size={40}
							className="mx-auto mb-3 opacity-30"
						/>
						<p className="text-sm font-medium">
							No hay presupuestos creados
						</p>
						<p className="text-xs text-gray-400 mt-1">
							Crea un límite mensual por categoría para comenzar
							el control.
						</p>
					</div>
				) : (
					initialBudgets.map((item) => {
						const porcentaje = Math.min(
							Math.round((item.gastado / item.limite) * 100),
							100,
						);
						const isOverBudget = item.gastado > item.limite;

						// Dynamic progress bar colors based on consumption percentage
						let colorClass = "bg-emerald-500";
						if (porcentaje >= 100) {
							colorClass = "bg-red-500";
						} else if (porcentaje >= 80) {
							colorClass = "bg-amber-500";
						} else if (porcentaje >= 50) {
							colorClass = "bg-blue-500";
						}

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
										<div className="flex items-center gap-1">
											<button
												onClick={() => openEdit(item)}
												className="text-gray-500 hover:text-white transition p-1.5 rounded-md hover:bg-[#1f1f23]"
												title="Editar"
											>
												<Edit2 size={14} />
											</button>
											<button
												onClick={() =>
													handleDelete(item.id)
												}
												className="text-gray-500 hover:text-red-400 transition p-1.5 rounded-md hover:bg-[#1f1f23]"
												title="Eliminar"
											>
												<Trash2 size={14} />
											</button>
										</div>
									</div>

									{/* Montos */}
									<div className="flex justify-between items-baseline mb-2">
										<div>
											<span className="text-2xl font-bold text-white">
												{formatMoney(item.gastado)}
											</span>
											<span className="text-xs text-gray-400 ml-1.5">
												/ {formatMoney(item.limite)}
											</span>
										</div>
										<span
											className={`text-xs font-semibold px-2 py-0.5 rounded border ${
												isOverBudget
													? "bg-red-950/50 text-red-400 border-red-900/50"
													: porcentaje >= 80
														? "bg-amber-950/50 text-amber-400 border-amber-900/50"
														: "bg-emerald-950/50 text-emerald-400 border-emerald-900/50"
											}`}
										>
											{porcentaje}%
										</span>
									</div>

									{/* Barra de Progreso */}
									<div className="w-full bg-[#1f1f23] rounded-full h-2.5 overflow-hidden border border-gray-800">
										<div
											className={`h-2.5 rounded-full transition-all duration-500 ${colorClass}`}
											style={{
												width: `${Math.min((item.gastado / item.limite) * 100, 100)}%`,
											}}
										/>
									</div>
								</div>

								{/* Alerta si excede el presupuesto */}
								{isOverBudget && (
									<div className="bg-red-950/30 border border-red-900/50 p-2.5 rounded-lg text-red-300 text-xs flex items-center gap-2 animate-pulse">
										<AlertTriangle
											size={15}
											className="shrink-0"
										/>
										<span>
											Has superado el límite de este
											presupuesto por{" "}
											{formatMoney(
												item.gastado - item.limite,
											)}
											.
										</span>
									</div>
								)}
							</div>
						);
					})
				)}
			</div>

			{/* Modal to create or edit budgets with a dynamic unique key so states reset on open */}
			<BudgetModal
				key={isModalOpen ? editData?.id || "create" : "closed"}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				initialData={editData}
			/>
		</div>
	);
}
