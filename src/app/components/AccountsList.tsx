"use client";

import React, { useTransition } from "react";
import { Wallet, CreditCard, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Interfaz adaptada a la respuesta tipada de Prisma PostgreSQL
export interface FinancialAccountItem {
	id: string;
	name: string;
	type: "debit_card" | "credit_card" | "cash" | "savings";
	balance: number | string;
	creditLimit?: number | string | null;
	cutoffDay?: number | null;
	paymentDueDate?: number | null;
	currency: string;
}

interface AccountsListProps {
	accounts: FinancialAccountItem[];
	deleteAccountAction: (id: string) => Promise<void>;
}

export const AccountsList = ({
	accounts,
	deleteAccountAction,
}: AccountsListProps) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleDelete = (id: string) => {
		startTransition(async () => {
			await deleteAccountAction(id);
			router.refresh();
		});
	};

	return (
		<div className="w-full">
			{accounts.length === 0 ? (
				<div className="text-center py-12 bg-[#17171a] border border-gray-800 rounded-xl">
					<p className="text-gray-400 text-sm">
						No hay cuentas o tarjetas registradas en la base de
						datos.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{accounts.map((item) => {
						const isCredit = item.type === "credit_card";
						const balanceNum = Number(item.balance) || 0;
						const limitNum = Number(item.creditLimit) || 0;

						return (
							<div
								key={item.id}
								className="bg-[#141416] p-5 rounded-xl border border-gray-800 flex flex-col justify-between hover:border-gray-700 transition"
							>
								<div>
									<div className="flex justify-between items-start mb-3">
										<div className="flex items-center gap-3">
											<div
												className={`p-2 rounded-lg border ${
													isCredit
														? "bg-purple-950/50 text-purple-400 border-purple-900/50"
														: "bg-blue-950/50 text-blue-400 border-blue-900/50"
												}`}
											>
												{isCredit ? (
													<CreditCard size={20} />
												) : (
													<Wallet size={20} />
												)}
											</div>
											<div>
												<h3 className="font-semibold text-white text-sm">
													{item.name}
												</h3>
												<span className="text-[10px] text-gray-400 uppercase tracking-wider">
													{isCredit
														? "Tarjeta de Crédito"
														: "Cuenta / Efectivo"}
												</span>
											</div>
										</div>
										<button
											onClick={() =>
												handleDelete(item.id)
											}
											disabled={isPending}
											className="text-gray-500 hover:text-red-400 transition p-1 disabled:opacity-50"
											title="Eliminar cuenta"
										>
											<Trash2 size={16} />
										</button>
									</div>

									<div className="space-y-1.5 text-xs mt-4 border-t border-gray-800 pt-3">
										{isCredit ? (
											<>
												<div className="flex justify-between text-gray-400">
													<span>
														Límite de Crédito:
													</span>
													<span className="font-medium text-white">
														${limitNum.toFixed(2)}{" "}
														{item.currency}
													</span>
												</div>
												{item.cutoffDay && (
													<div className="flex justify-between text-gray-400">
														<span>
															Día de Corte:
														</span>
														<span className="font-medium text-white">
															Día {item.cutoffDay}
														</span>
													</div>
												)}
												{item.paymentDueDate && (
													<div className="flex justify-between text-gray-400">
														<span>
															Límite de Pago:
														</span>
														<span className="font-medium text-white">
															Día{" "}
															{
																item.paymentDueDate
															}
														</span>
													</div>
												)}
											</>
										) : (
											<div className="flex justify-between items-center">
												<span className="text-gray-400">
													Saldo Actual:
												</span>
												<span className="text-base font-bold text-emerald-400">
													${balanceNum.toFixed(2)}{" "}
													{item.currency}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};
