"use client";

import React, { useRef, useState, useTransition } from "react";
import {
	ArrowUp,
	Bot,
	Loader2,
	Sparkles,
	User,
	Wallet,
	AlertCircle,
	CheckCircle2,
	Mic,
} from "lucide-react";
import { processFinancialPrompt } from "@/app/actions/agent";
import {
	ProcessedAccount,
	ProcessedBudget,
	ProcessedTransaction,
} from "@/lib/schemas/agent";

type ChatEntry = {
	id: string;
	role: "user" | "assistant";
	text: string;
	results?: Array<
		| { type: "transaction"; data: ProcessedTransaction }
		| { type: "budget"; data: ProcessedBudget }
		| { type: "account"; data: ProcessedAccount }
	>;
	error?: string;
};

const EXAMPLES = [
	"Gasté $350 en gasolina con mi tarjeta BBVA",
	"Crea un presupuesto de $4,000 para Alimentos",
	"Agrega una tarjeta de débito Nu con saldo inicial de $2,500",
];

const TYPE_LABEL: Record<string, string> = {
	expense: "Gasto",
	income: "Ingreso",
	transfer: "Transferencia",
};

function formatMoney(value: number) {
	return new Intl.NumberFormat("es-MX", {
		style: "currency",
		currency: "MXN",
	}).format(value);
}

function formatDate(iso: string) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return iso;
	return date.toLocaleDateString("es-MX", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export default function AIAgentPage() {
	const [prompt, setPrompt] = useState("");
	const [history, setHistory] = useState<ChatEntry[]>([]);
	const [isPending, startTransition] = useTransition();
	const [isListening, setIsListening] = useState(false);
	const listRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		requestAnimationFrame(() => {
			listRef.current?.scrollTo({
				top: listRef.current.scrollHeight,
				behavior: "smooth",
			});
		});
	};
	const submitPrompt = (text: string) => {
		const message = text.trim();
		if (!message || isPending) return;

		const previousText = message;
		const userId = crypto.randomUUID();

		setHistory((prev) => [
			...prev,
			{ id: userId, role: "user", text: message },
		]);

		setPrompt("");
		scrollToBottom();

		startTransition(async () => {
			try {
				const result = await processFinancialPrompt(message);

				if (result.success) {
					setHistory((prev) => [
						...prev,
						{
							id: crypto.randomUUID(),
							role: "assistant",
							text: result.message || "Procesado correctamente.",
							results: result.results,
						},
					]);
				} else {
					setPrompt(previousText);

					setHistory((prev) => [
						...prev,
						{
							id: crypto.randomUUID(),
							role: "assistant",
							text:
								result.error || "Ocurrió un error al procesar.",
							error: result.error || "Error indeterminado.",
						},
					]);
				}
			} catch (error) {
				setPrompt(previousText);
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error desconocido al procesar la solicitud.";

				setHistory((prev) => [
					...prev,
					{
						id: crypto.randomUUID(),
						role: "assistant",
						text: errorMessage,
						error: errorMessage,
					},
				]);
			}
			scrollToBottom();
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		submitPrompt(prompt);
	};
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const adjustTextareaHeight = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			const newHeight = Math.min(textarea.scrollHeight, 96);
			textarea.style.height = `${newHeight}px`;

			// Mostrar scroll solo si el contenido supera la altura máxima
			if (textarea.scrollHeight > 96) {
				textarea.style.overflowY = "auto";
			} else {
				textarea.style.overflowY = "hidden";
			}
		}
	};
	return (
		<div className="max-w-4xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col gap-5">
			<div className="bg-[#17171a] border border-gray-800 rounded-xl p-6 shadow-sm flex items-center justify-between shrink-0">
				<div className="flex items-center gap-4">
					<div className="p-3 bg-emerald-950/50 text-emerald-400 rounded-xl border border-emerald-900/50">
						<Sparkles size={24} />
					</div>
					<div>
						<h1 className="text-xl font-bold text-white tracking-tight">
							Agente IA
						</h1>
						<p className="text-xs text-gray-400 mt-0.5">
							Registra movimientos, crea presupuestos o agrega
							cuentas con lenguaje natural o dictado por voz.
						</p>
					</div>
				</div>
			</div>

			<div className="flex-1 min-h-0 bg-[#17171a] border border-gray-800 rounded-xl shadow-sm flex flex-col overflow-hidden">
				<div
					ref={listRef}
					className="flex-1 overflow-y-auto p-5 space-y-4"
				>
					{history.length === 0 && (
						<div className="h-full flex flex-col items-center justify-center text-center px-6">
							<div className="p-3 bg-emerald-950/40 text-emerald-400 rounded-xl border border-emerald-900/40 mb-4">
								<Bot size={28} />
							</div>
							<p className="text-sm text-white font-medium">
								Consola del agente
							</p>
							<p className="text-xs text-gray-400 mt-1 max-w-md">
								Escribe o dicta lo que deseas realizar (gastos,
								presupuestos o cuentas) y la IA interpretará los
								datos para actualizar tus finanzas.
							</p>
							<div className="flex flex-wrap justify-center gap-2 mt-5">
								{EXAMPLES.map((example) => (
									<button
										key={example}
										type="button"
										onClick={() => submitPrompt(example)}
										disabled={isPending}
										className="text-[11px] text-gray-300 bg-[#1f1f23] border border-gray-800 hover:border-emerald-700/60 hover:text-emerald-400 rounded-lg px-3 py-2 transition disabled:opacity-50"
									>
										{example}
									</button>
								))}
							</div>
						</div>
					)}

					{history.map((entry) =>
						entry.role === "user" ? (
							<div
								key={entry.id}
								className="flex justify-end gap-2"
							>
								<div className="max-w-[85%] bg-[#1f1f23] border border-gray-800 rounded-xl px-4 py-3">
									<p className="text-sm text-white whitespace-pre-wrap">
										{entry.text}
									</p>
								</div>
								<div className="h-8 w-8 rounded-lg bg-[#27272a] border border-gray-800 flex items-center justify-center text-gray-300 shrink-0">
									<User size={14} />
								</div>
							</div>
						) : (
							<div
								key={entry.id}
								className="flex justify-start gap-2"
							>
								<div className="h-8 w-8 rounded-lg bg-emerald-950/50 border border-emerald-900/50 flex items-center justify-center text-emerald-400 shrink-0">
									<Bot size={14} />
								</div>
								<div className="max-w-[90%] space-y-3">
									{entry.error ? (
										<div className="bg-red-950/20 border border-red-900/50 text-red-200 rounded-xl p-4 flex gap-3 max-w-lg shadow-sm">
											<AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
											<div className="space-y-1">
												<span className="text-[11px] font-bold uppercase tracking-wider text-red-400 block">
													Error de procesamiento
												</span>
												<p className="text-xs text-red-300 leading-relaxed">
													{entry.text}
												</p>
											</div>
										</div>
									) : (
										<>
											<p className="text-sm text-gray-200">
												{entry.text}
											</p>
											{entry.results &&
												entry.results.length > 0 && (
													<div className="space-y-3 pt-1">
														{entry.results.map(
															(res, index) => (
																<React.Fragment
																	key={index}
																>
																	{res.type ===
																		"transaction" && (
																		<TransactionCard
																			tx={
																				res.data
																			}
																		/>
																	)}
																	{res.type ===
																		"budget" && (
																		<BudgetCard
																			budget={
																				res.data
																			}
																		/>
																	)}
																	{res.type ===
																		"account" && (
																		<AccountCard
																			account={
																				res.data
																			}
																		/>
																	)}
																</React.Fragment>
															),
														)}
													</div>
												)}
										</>
									)}
								</div>
							</div>
						),
					)}

					{isPending && (
						<div className="flex items-center gap-2 text-emerald-400 text-xs">
							<Loader2 size={14} className="animate-spin" />
							Analizando tu solicitud y actualizando datos…
						</div>
					)}
				</div>

				<form
					onSubmit={handleSubmit}
					className="border-t border-gray-800 p-4 bg-[#141416]"
				>
					<div className="flex items-end gap-2">
						<textarea
							ref={textareaRef}
							value={prompt}
							onChange={(e) => {
								setPrompt(e.target.value);
								adjustTextareaHeight();
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									submitPrompt(prompt);
									if (textareaRef.current) {
										textareaRef.current.style.height =
											"auto";
										textareaRef.current.style.overflowY =
											"hidden";
									}
								}
							}}
							placeholder="P. ej. Gasté $200 en café..."
							rows={1}
							disabled={isPending}
							className="flex-1 resize-none overflow-hidden min-h-[44px] max-h-24 rounded-xl bg-[#1f1f23] border border-gray-800 p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 disabled:opacity-60"
						/>

						{/* Botón de Enviar */}
						<button
							type="submit"
							disabled={isPending || !prompt.trim()}
							className="h-11 w-11 shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black disabled:opacity-40 flex items-center justify-center transition"
							aria-label="Enviar"
						>
							{isPending ? (
								<Loader2 size={18} className="animate-spin" />
							) : (
								<ArrowUp size={18} />
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function TransactionCard({ tx }: { tx: ProcessedTransaction }) {
	const isIncome = tx.type === "income";
	const amount = typeof tx.amount === "number" ? tx.amount : 0;
	const accountBalance =
		typeof tx.accountBalance === "number" ? tx.accountBalance : 0;

	return (
		<div className="rounded-xl bg-[#141416] border border-gray-800 p-4 space-y-3">
			<div className="flex items-center justify-between">
				<span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
					Transacción procesada
				</span>
				<span
					className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
						isIncome
							? "text-emerald-400 bg-emerald-950/40 border-emerald-900/50"
							: "text-red-300 bg-red-950/30 border-red-900/40"
					}`}
				>
					{TYPE_LABEL[tx.type] ?? tx.type}
				</span>
			</div>
			<div className="grid grid-cols-2 gap-2 text-xs">
				<div className="bg-[#1f1f23] border border-gray-800 rounded-lg p-2.5">
					<span className="text-gray-500 block text-[10px]">
						Descripción
					</span>
					<span className="text-white font-medium">
						{tx.description || "Sin descripción"}
					</span>
				</div>
				<div className="bg-[#1f1f23] border border-gray-800 rounded-lg p-2.5">
					<span className="text-gray-500 block text-[10px]">
						Monto
					</span>
					<span
						className={`font-medium ${isIncome ? "text-emerald-400" : "text-white"}`}
					>
						{isIncome ? "+" : "-"}
						{formatMoney(amount)}
					</span>
				</div>
				<div className="bg-[#1f1f23] border border-gray-800 rounded-lg p-2.5">
					<span className="text-gray-500 block text-[10px]">
						Categoría
					</span>
					<span className="text-white font-medium">
						{tx.category || "General"}
					</span>
				</div>
				<div className="bg-[#1f1f23] border border-gray-800 rounded-lg p-2.5">
					<span className="text-gray-500 block text-[10px]">
						Fecha
					</span>
					<span className="text-white font-medium">
						{tx.date ? formatDate(tx.date) : "N/A"}
					</span>
				</div>
				<div className="bg-[#1f1f23] border border-gray-800 rounded-lg p-2.5 col-span-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-gray-400">
							<Wallet size={14} className="text-emerald-400" />
							<span>{tx.accountName || "Cuenta"}</span>
						</div>
						<span className="text-white font-medium">
							Saldo {formatMoney(accountBalance)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

function BudgetCard({ budget }: { budget: ProcessedBudget }) {
	const category = budget.categoria ?? budget.category ?? "General";
	const limit = budget.limite ?? budget.limit ?? 0;

	return (
		<div className="rounded-xl bg-[#141416] border border-gray-800 p-4 space-y-3 max-w-md">
			<div className="flex items-center justify-between">
				<span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
					Presupuesto Creado
				</span>
				<span className="text-[11px] font-medium px-2 py-0.5 rounded-md border text-emerald-400 bg-emerald-950/40 border-emerald-900/50">
					Mensual
				</span>
			</div>
			<div className="grid grid-cols-2 gap-2 text-xs">
				<div className="bg-[#1f1f23] border border-gray-800 rounded-lg p-2.5">
					<span className="text-gray-500 block text-[10px]">
						Categoría
					</span>
					<span className="text-white font-medium">{category}</span>
				</div>
				<div className="bg-[#1f1f23] border border-gray-800 rounded-lg p-2.5">
					<span className="text-gray-500 block text-[10px]">
						Límite Asignado
					</span>
					<span className="text-emerald-400 font-medium">
						{formatMoney(limit)}
					</span>
				</div>
			</div>
		</div>
	);
}

function AccountCard({ account }: { account: ProcessedAccount }) {
	const isCredit = account.type === "credit_card";

	const creditLimit = account.creditLimit ?? account.limiteCredito;
	const cutoffDay = account.cutoffDay ?? account.cierre;
	const paymentDueDate = account.paymentDueDate ?? account.limitePago;

	return (
		<div className="rounded-xl bg-[#141416] border border-gray-800 p-3.5 space-y-2.5 text-xs">
			<div className="flex items-center justify-between">
				<span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
					<CheckCircle2 className="w-3 h-3" /> Cuenta Creada
				</span>
				<span className="text-[10px] font-medium px-2 py-0.5 rounded border text-purple-400 bg-purple-950/40 border-purple-900/50 uppercase">
					{account.type}
				</span>
			</div>

			<div className="grid grid-cols-2 gap-2">
				<div className="bg-[#1f1f23] p-2 rounded-lg border border-gray-800">
					<span className="text-gray-500 text-[10px] block">
						Nombre
					</span>
					<span className="text-white font-medium truncate block">
						{account.name}
					</span>
				</div>
				<div className="bg-[#1f1f23] p-2 rounded-lg border border-gray-800">
					<span className="text-gray-500 text-[10px] block">
						{isCredit ? "Deuda Actual" : "Saldo Inicial"}
					</span>
					<span className="text-emerald-400 font-semibold block">
						{formatMoney(account.balance ?? 0)}
					</span>
				</div>
			</div>

			{isCredit && (
				<div className="grid grid-cols-3 gap-2 pt-1">
					<div className="bg-[#1f1f23] p-2 rounded-lg border border-gray-800">
						<span className="text-gray-500 text-[10px] block">
							Límite Crédito
						</span>
						<span className="text-white font-medium block">
							{creditLimit ? formatMoney(creditLimit) : "N/A"}
						</span>
					</div>
					<div className="bg-[#1f1f23] p-2 rounded-lg border border-gray-800">
						<span className="text-gray-500 text-[10px] block">
							Día Corte
						</span>
						<span className="text-gray-200 font-medium block">
							{cutoffDay ? `Día ${cutoffDay}` : "N/A"}
						</span>
					</div>
					<div className="bg-[#1f1f23] p-2 rounded-lg border border-gray-800">
						<span className="text-gray-500 text-[10px] block">
							Límite Pago
						</span>
						<span className="text-gray-200 font-medium block">
							{paymentDueDate ? `Día ${paymentDueDate}` : "N/A"}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
