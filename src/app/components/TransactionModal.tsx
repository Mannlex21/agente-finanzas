"use client";

import React, { useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { createTransaction } from "@/app/actions/transactions";

interface AccountItem {
	id: string;
	name: string;
	type: string;
	balance: number;
}

interface TransactionModalProps {
	isOpen: boolean;
	onClose: () => void;
	accounts: AccountItem[];
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
	"Ingreso",
	"Otros",
];

export const TransactionModal = ({
	isOpen,
	onClose,
	accounts,
}: TransactionModalProps) => {
	const [isPending, startTransition] = useTransition();

	const [comercio, setComercio] = useState("");
	const [monto, setMonto] = useState("");
	const [categoria, setCategoria] = useState(CATEGORIES[0]);
	const [tipo, setTipo] = useState<"gasto" | "ingreso">("gasto");
	const [accountId, setAccountId] = useState("");
	const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
	const [error, setError] = useState<string | null>(null);

	if (!isOpen) return null;

	const activeAccountId = accountId || accounts[0]?.id || "";

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		const amountNum = parseFloat(monto);
		if (!comercio.trim()) {
			setError("El comercio o descripción es obligatorio.");
			return;
		}
		if (isNaN(amountNum) || amountNum <= 0) {
			setError("El monto debe ser un número positivo.");
			return;
		}
		if (!activeAccountId) {
			setError("Debes seleccionar una cuenta.");
			return;
		}

		startTransition(async () => {
			const res = await createTransaction({
				comercio: comercio.trim(),
				monto: amountNum,
				categoria,
				tipo,
				accountId: activeAccountId,
				createdAt: fecha ? new Date(fecha).toISOString() : undefined,
			});

			if (res.success) {
				// Reset and close
				setComercio("");
				setMonto("");
				setCategoria(CATEGORIES[0]);
				setTipo("gasto");
				setFecha(new Date().toISOString().split("T")[0]);
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
					Nueva Transacción
				</h3>

				{error && (
					<div className="bg-red-950/40 border border-red-900/50 rounded-lg p-3 text-xs text-red-400 mb-4">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-xs font-medium text-gray-400 mb-1">
							Comercio / Descripción
						</label>
						<input
							type="text"
							required
							placeholder="Ej. Starbucks, Walmart, Pago de internet..."
							value={comercio}
							onChange={(e) => setComercio(e.target.value)}
							disabled={isPending}
							className="w-full px-3 py-2 bg-[#1f1f23] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm disabled:opacity-50"
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="block text-xs font-medium text-gray-400 mb-1">
								Tipo
							</label>
							<select
								value={tipo}
								onChange={(e) =>
									setTipo(
										e.target.value as "gasto" | "ingreso",
									)
								}
								disabled={isPending}
								className="w-full px-3 py-2 bg-[#1f1f23] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm disabled:opacity-50"
							>
								<option value="gasto">Gasto</option>
								<option value="ingreso">Ingreso</option>
							</select>
						</div>

						<div>
							<label className="block text-xs font-medium text-gray-400 mb-1">
								Monto ($)
							</label>
							<input
								type="number"
								step="0.01"
								required
								placeholder="0.00"
								value={monto}
								onChange={(e) => setMonto(e.target.value)}
								disabled={isPending}
								className="w-full px-3 py-2 bg-[#1f1f23] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm disabled:opacity-50"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="block text-xs font-medium text-gray-400 mb-1">
								Categoría
							</label>
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
						</div>

						<div>
							<label className="block text-xs font-medium text-gray-400 mb-1">
								Fecha
							</label>
							<input
								type="date"
								required
								value={fecha}
								onChange={(e) => setFecha(e.target.value)}
								disabled={isPending}
								className="w-full px-3 py-2 bg-[#1f1f23] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm disabled:opacity-50"
							/>
						</div>
					</div>

					<div>
						<label className="block text-xs font-medium text-gray-400 mb-1">
							Cuenta / Origen
						</label>
						<select
							value={activeAccountId}
							onChange={(e) => setAccountId(e.target.value)}
							disabled={isPending}
							className="w-full px-3 py-2 bg-[#1f1f23] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm disabled:opacity-50"
						>
							{accounts.length === 0 ? (
								<option value="">
									No hay cuentas registradas
								</option>
							) : (
								accounts.map((acc) => (
									<option key={acc.id} value={acc.id}>
										{acc.name} ({acc.type})
									</option>
								))
							)}
						</select>
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
							disabled={isPending || accounts.length === 0}
							className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black rounded-lg transition text-xs font-medium shadow-sm disabled:opacity-50"
						>
							{isPending && (
								<Loader2 size={14} className="animate-spin" />
							)}
							Guardar Transacción
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
