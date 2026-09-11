"use client";

import React, { useState, useEffect, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { createBudget, updateBudget } from "@/app/actions/budgets";

interface BudgetModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialData?: {
		id: string;
		categoria: string;
		limite: number;
	} | null;
}

const CATEGORIES = [
	"Alimentación",
	"Transporte",
	"Servicios",
	"Entretenimiento",
	"Salud",
	"Educación",
	"Suscripciones",
	"Vivienda",
	"Otros",
];

export const BudgetModal = ({
	isOpen,
	onClose,
	initialData,
}: BudgetModalProps) => {
	const [isPending, startTransition] = useTransition();

	const [categoria, setCategoria] = useState(
		initialData?.categoria || CATEGORIES[0],
	);
	const [limite, setLimite] = useState(initialData?.limite?.toString() || "");
	const [error, setError] = useState<string | null>(null);

	if (!isOpen) return null;

	const isEditing = !!initialData;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		const limitNum = parseFloat(limite);
		if (!categoria.trim()) {
			setError("La categoría es obligatoria.");
			return;
		}
		if (isNaN(limitNum) || limitNum <= 0) {
			setError("El límite debe ser un número positivo.");
			return;
		}

		startTransition(async () => {
			let res;
			if (isEditing && initialData) {
				res = await updateBudget(initialData.id, {
					categoria: categoria.trim(),
					limite: limitNum,
				});
			} else {
				res = await createBudget({
					categoria: categoria.trim(),
					limite: limitNum,
				});
			}

			if (res.success) {
				onClose();
			} else {
				setError(res.error || "Ocurrió un error al guardar.");
			}
		});
	};

	return (
		<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
			<div className="bg-[#17171a] border border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
				<button
					onClick={onClose}
					disabled={isPending}
					className="absolute top-4 right-4 text-gray-400 hover:text-white transition disabled:opacity-50"
				>
					<X size={20} />
				</button>

				<h3 className="text-lg font-bold text-white mb-4">
					{isEditing ? "Editar Presupuesto" : "Nuevo Presupuesto"}
				</h3>

				{error && (
					<div className="bg-red-950/40 border border-red-900/50 rounded-lg p-3 text-xs text-red-400 mb-4">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-xs font-medium text-gray-400 mb-1">
							Categoría
						</label>
						{isEditing ? (
							<div className="w-full px-3 py-2 bg-[#1f1f23] border border-gray-800 rounded-lg text-white text-sm opacity-60">
								{categoria}
							</div>
						) : (
							<select
								value={categoria}
								onChange={(e) => setCategoria(e.target.value)}
								disabled={isPending}
								className="w-full px-3 py-2 bg-[#1f1f23] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm disabled:opacity-50"
							>
								{CATEGORIES.map((cat) => (
									<option key={cat} value={cat}>
										{cat}
									</option>
								))}
							</select>
						)}
					</div>

					<div>
						<label className="block text-xs font-medium text-gray-400 mb-1">
							Límite Mensual ($)
						</label>
						<input
							type="number"
							step="0.01"
							required
							placeholder="Ej. 3000"
							value={limite}
							onChange={(e) => setLimite(e.target.value)}
							disabled={isPending}
							className="w-full px-3 py-2 bg-[#1f1f23] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm disabled:opacity-50"
						/>
					</div>

					<div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
						<button
							type="button"
							onClick={onClose}
							disabled={isPending}
							className="px-4 py-2 border border-gray-800 text-gray-300 rounded-lg hover:bg-[#1f1f23] transition text-xs font-medium disabled:opacity-50"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={isPending}
							className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black rounded-lg transition text-xs font-medium shadow-sm disabled:opacity-50"
						>
							{isPending && (
								<Loader2 size={14} className="animate-spin" />
							)}
							{isEditing
								? "Guardar Cambios"
								: "Crear Presupuesto"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
