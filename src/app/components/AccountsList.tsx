"use client";

import React from "react";
import { useAccounts } from "@/context/AccountContext";
import { Wallet, CreditCard, Trash2 } from "lucide-react";

export const AccountsList = ({ onOpenModal }: { onOpenModal: () => void }) => {
	const { accounts, loading, removeAccount } = useAccounts();

	if (loading) {
		return (
			<div className="text-center py-10 text-gray-500">
				Cargando cuentas...
			</div>
		);
	}

	return (
		<div className="w-full">
			{accounts.length === 0 ? (
				<div className="text-center py-12 bg-[#17171a] border border-gray-800 rounded-xl">
					<p className="text-gray-400 text-sm">
						No hay cuentas o tarjetas registradas.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{accounts.map((item) => {
						const isCredit = item.type === "credit_card";
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
												removeAccount(item.id)
											}
											className="text-gray-500 hover:text-red-400 transition p-1"
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
														$
														{item.creditLimit?.toFixed(
															2,
														)}{" "}
														{item.currency}
													</span>
												</div>
												<div className="flex justify-between text-gray-400">
													<span>Día de Corte:</span>
													<span className="font-medium text-white">
														Día {item.cutoffDay}
													</span>
												</div>
												<div className="flex justify-between text-gray-400">
													<span>Límite de Pago:</span>
													<span className="font-medium text-white">
														Día{" "}
														{item.paymentDueDate}
													</span>
												</div>
											</>
										) : (
											<div className="flex justify-between items-center">
												<span className="text-gray-400">
													Saldo Actual:
												</span>
												<span className="text-base font-bold text-emerald-400">
													${item.balance.toFixed(2)}{" "}
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
