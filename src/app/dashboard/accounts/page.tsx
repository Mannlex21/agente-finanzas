"use client";

import React, { useState } from "react";
import { AccountsList } from "@/app/components/AccountsList";
import { AccountModal } from "@/app/components/AccountModal";
import { Plus, CreditCard } from "lucide-react";

export default function AccountsPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			{/* Encabezado Principal */}
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
					className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-black font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
				>
					<Plus size={16} />
					Nueva Cuenta
				</button>
			</div>

			{/* Contenedor central de la lista de cuentas */}
			<div className="bg-[#17171a] border border-gray-800 rounded-xl p-6 shadow-sm">
				<AccountsList onOpenModal={() => setIsModalOpen(true)} />
			</div>

			{/* Modal para agregar cuentas */}
			<AccountModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
}
