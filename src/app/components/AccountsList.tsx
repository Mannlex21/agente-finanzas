"use client";

import React from "react";
import { Trash2, CreditCard, Landmark, Wallet } from "lucide-react";

interface Account {
	id: string;
	name: string;
	type: string;
	balance: number;
	creditLimit: number | null;
	cutoffDay?: number | null;
	paymentDueDate?: number | null;
}

function formatMoney(value: number) {
	return new Intl.NumberFormat("es-MX", {
		style: "currency",
		currency: "MXN",
	}).format(value);
}

// Tarjeta para Crédito (Más alta, incluye corte, pago y límite)
function CreditAccountCard({
	account,
	onDelete,
}: {
	account: Account;
	onDelete: (id: string) => void;
}) {
	const availableCredit = account.creditLimit
		? account.creditLimit - account.balance
		: null;

	return (
		<div className="bg-[#1f1f23] border border-gray-800 rounded-xl p-5 flex flex-col justify-between h-full gap-4">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-3">
					<div className="p-2.5 bg-purple-950/40 border border-purple-900/50 rounded-lg text-purple-400">
						<CreditCard size={20} />
					</div>
					<div>
						<h3 className="font-semibold text-white text-sm">
							{account.name}
						</h3>
						<span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">
							Tarjeta de Crédito
						</span>
					</div>
				</div>
				<button
					onClick={() => onDelete(account.id)}
					className="text-gray-500 hover:text-red-400 transition p-1 cursor-pointer"
					title="Eliminar cuenta"
				>
					<Trash2 size={16} />
				</button>
			</div>

			<div className="space-y-2 border-t border-gray-800/80 pt-3">
				<div className="flex justify-between items-center text-xs">
					<span className="text-gray-400">Deuda Actual:</span>
					<span
						className={`font-bold ${account.balance > 0 ? "text-red-400" : "text-emerald-400"}`}
					>
						{formatMoney(account.balance)}
					</span>
				</div>

				{account.creditLimit !== null && (
					<div className="flex justify-between items-center text-xs">
						<span className="text-gray-400">
							Límite de Crédito:
						</span>
						<span className="font-semibold text-white">
							{formatMoney(account.creditLimit)}
						</span>
					</div>
				)}

				{availableCredit !== null && (
					<div className="flex justify-between items-center text-xs">
						<span className="text-gray-400">
							Crédito Disponible:
						</span>
						<span className="font-medium text-emerald-400">
							{formatMoney(availableCredit)}
						</span>
					</div>
				)}

				{(account.cutoffDay || account.paymentDueDate) && (
					<div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800/50 text-[11px] text-gray-400">
						{account.cutoffDay && (
							<div>
								Día Corte:{" "}
								<span className="text-gray-200 font-medium">
									Día {account.cutoffDay}
								</span>
							</div>
						)}
						{account.paymentDueDate && (
							<div>
								Límite Pago:{" "}
								<span className="text-gray-200 font-medium">
									Día {account.paymentDueDate}
								</span>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

// Tarjeta para Débito / Banco / Efectivo (Compacta y uniforme)
function StandardAccountCard({
	account,
	onDelete,
}: {
	account: Account;
	onDelete: (id: string) => void;
}) {
	return (
		<div className="bg-[#1f1f23] border border-gray-800 rounded-xl p-5 flex flex-col justify-between h-full gap-4">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-3">
					<div className="p-2.5 bg-emerald-950/40 border border-emerald-900/50 rounded-lg text-emerald-400">
						<Landmark size={20} />
					</div>
					<div>
						<h3 className="font-semibold text-white text-sm">
							{account.name}
						</h3>
						<span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
							Débito / Banco
						</span>
					</div>
				</div>
				<button
					onClick={() => onDelete(account.id)}
					className="text-gray-500 hover:text-red-400 transition p-1 cursor-pointer"
					title="Eliminar cuenta"
				>
					<Trash2 size={16} />
				</button>
			</div>

			<div className="border-t border-gray-800/80 pt-3">
				<div className="flex justify-between items-center text-xs">
					<span className="text-gray-400">Saldo Disponible:</span>
					<span className="font-bold text-emerald-400 text-sm">
						{formatMoney(account.balance)}
					</span>
				</div>
			</div>
		</div>
	);
}

// Componente principal organizado por secciones
export function AccountsList({
	accounts,
	deleteAccountAction,
}: {
	accounts: Account[];
	deleteAccountAction: (id: string) => void;
}) {
	if (accounts.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500 text-sm">
				No hay cuentas registradas.
			</div>
		);
	}

	const creditAccounts = accounts.filter(
		(acc) =>
			acc.type.toLowerCase() === "credit_card" ||
			acc.type.toLowerCase() === "creditcard",
	);
	const standardAccounts = accounts.filter(
		(acc) =>
			acc.type.toLowerCase() !== "credit_card" &&
			acc.type.toLowerCase() !== "creditcard",
	);

	return (
		<div className="space-y-8">
			{/* Sección 1: Cuentas de Débito y Efectivo */}
			{standardAccounts.length > 0 && (
				<div className="space-y-4">
					<h2 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
						Cuentas de Débito y Efectivo ({standardAccounts.length})
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{standardAccounts.map((account) => (
							<StandardAccountCard
								key={account.id}
								account={account}
								onDelete={deleteAccountAction}
							/>
						))}
					</div>
				</div>
			)}

			{/* Sección 2: Tarjetas de Crédito */}
			{creditAccounts.length > 0 && (
				<div className="space-y-4">
					<h2 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
						Tarjetas de Crédito ({creditAccounts.length})
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{creditAccounts.map((account) => (
							<CreditAccountCard
								key={account.id}
								account={account}
								onDelete={deleteAccountAction}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
