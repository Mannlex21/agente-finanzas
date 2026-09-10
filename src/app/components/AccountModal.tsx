"use client";

import React, { useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { createAccountAction } from "@/app/actions/accounts";
import { AccountType } from "@prisma/client";

interface AccountModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const AccountModal = ({ isOpen, onClose }: AccountModalProps) => {
	const [isPending, startTransition] = useTransition();

	const [name, setName] = useState("");
	const [type, setType] = useState<AccountType>(AccountType.debit_card);
	const [balance, setBalance] = useState("");
	const [creditLimit, setCreditLimit] = useState("");
	const [cutoffDay, setCutoffDay] = useState("");
	const [paymentDueDate, setPaymentDueDate] = useState("");
	const [currency, setCurrency] = useState("MXN");

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		startTransition(async () => {
			await createAccountAction({
				name,
				type,
				currency,
				balance: parseFloat(balance) || 0,
				creditLimit: parseFloat(creditLimit) || undefined,
				cutoffDay: parseInt(cutoffDay) || undefined,
				paymentDueDate: parseInt(paymentDueDate) || undefined,
			});

			// Reset de campos y cierre del modal
			setName("");
			setBalance("");
			setCreditLimit("");
			setCutoffDay("");
			setPaymentDueDate("");
			onClose();
		});
	};

	const isCredit = type === AccountType.credit_card;

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
					Nueva Cuenta o Tarjeta
				</h3>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-xs font-medium text-gray-400 mb-1">
							Nombre / Banco
						</label>
						<input
							type="text"
							required
							placeholder="Ej. BBVA Nómina o Tarjeta Visa"
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={isPending}
							className="w-full px-3 py-2 bg-[#1f1f23] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm disabled:opacity-50"
						/>
					</div>

					<div>
						<label className="block text-xs font-medium text-gray-400 mb-1">
							Tipo
						</label>
						<select
							value={type}
							onChange={(e) =>
								setType(e.target.value as AccountType)
							}
							disabled={isPending}
							className="w-full px-3 py-2 bg-[#1f1f23] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm disabled:opacity-50"
						>
							<option value={AccountType.debit_card}>
								Tarjeta de Débito
							</option>
							<option value={AccountType.credit_card}>
								Tarjeta de Crédito
							</option>
							<option value={AccountType.cash}>Efectivo</option>
							<option value={AccountType.savings}>
								Cuenta de Ahorro
							</option>
						</select>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="block text-xs font-medium text-gray-400 mb-1">
								Moneda
							</label>
							<select
								value={currency}
								onChange={(e) => setCurrency(e.target.value)}
								disabled={isPending}
								className="w-full px-3 py-2 bg-[#1f1f23] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm disabled:opacity-50"
							>
								<option value="MXN">MXN ($)</option>
								<option value="USD">USD ($)</option>
								<option value="EUR">EUR (€)</option>
							</select>
						</div>

						{!isCredit ? (
							<div>
								<label className="block text-xs font-medium text-gray-400 mb-1">
									Saldo Inicial
								</label>
								<input
									type="number"
									step="0.01"
									placeholder="0.00"
									value={balance}
									onChange={(e) => setBalance(e.target.value)}
									disabled={isPending}
									className="w-full px-3 py-2 bg-[#1f1f23] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm disabled:opacity-50"
								/>
							</div>
						) : (
							<div>
								<label className="block text-xs font-medium text-gray-400 mb-1">
									Límite de Crédito
								</label>
								<input
									type="number"
									step="0.01"
									placeholder="0.00"
									value={creditLimit}
									onChange={(e) =>
										setCreditLimit(e.target.value)
									}
									disabled={isPending}
									className="w-full px-3 py-2 bg-[#1f1f23] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm disabled:opacity-50"
								/>
							</div>
						)}
					</div>

					{isCredit && (
						<div className="grid grid-cols-2 gap-3 bg-purple-950/20 p-3 rounded-lg border border-purple-900/30">
							<div>
								<label className="block text-[11px] font-medium text-purple-300 mb-1">
									Día de Corte
								</label>
								<input
									type="number"
									min="1"
									max="31"
									placeholder="Ej. 15"
									value={cutoffDay}
									onChange={(e) =>
										setCutoffDay(e.target.value)
									}
									disabled={isPending}
									className="w-full px-3 py-1.5 bg-[#1f1f23] border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 text-white text-xs disabled:opacity-50"
								/>
							</div>
							<div>
								<label className="block text-[11px] font-medium text-purple-300 mb-1">
									Día Límite de Pago
								</label>
								<input
									type="number"
									min="1"
									max="31"
									placeholder="Ej. 5"
									value={paymentDueDate}
									onChange={(e) =>
										setPaymentDueDate(e.target.value)
									}
									disabled={isPending}
									className="w-full px-3 py-1.5 bg-[#1f1f23] border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 text-white text-xs disabled:opacity-50"
								/>
							</div>
						</div>
					)}

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
							Guardar Cuenta
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
