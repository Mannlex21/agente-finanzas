"use client";

import React, { useState } from "react";
import { Plus, CreditCard } from "lucide-react";
import { AccountModal } from "@/app/components/AccountModal";

export const AccountsHeader = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#17171a] border border-gray-800 rounded-xl p-6 shadow-sm">
				<div className="flex items-center gap-4">
					<div className="p-3 bg-emerald-950/50 text-emerald-400 rounded-xl border border-emerald-900/50">
						<CreditCard size={24} />
					</div>
					<div>
						<h1 className="text-xl font-bold text-white tracking-tight">
							Gestión de Cuentas y Tarjetas
						</h1>
						<p className="text-xs text-gray-400 mt-0.5">
							Administra tus tarjetas de crédito, débito, cuentas
							de ahorro y efectivo.
						</p>
					</div>
				</div>
				<button
					onClick={() => setIsModalOpen(true)}
					className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-black font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm cursor-pointer"
				>
					<Plus size={16} />
					Nueva Cuenta
				</button>
			</div>

			<AccountModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
};
