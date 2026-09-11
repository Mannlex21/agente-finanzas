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
} from "lucide-react";
import { processFinancialPrompt } from "@/app/actions/agent";
import {
	ProcessedAccount,
	ProcessedBudget,
	ProcessedTransaction,
} from "@/lib/schemas/agent";

type ChatEntry =
	| { id: string; role: "user"; text: string }
	| {
			id: string;
			role: "assistant";
			text: string;
			type?: undefined;
			data?: undefined;
			error?: undefined;
	  }
	| {
			id: string;
			role: "assistant";
			text: string;
			type: "transaction";
			data: ProcessedTransaction;
			error?: undefined;
	  }
	| {
			id: string;
			role: "assistant";
			text: string;
			type: "budget";
			data: ProcessedBudget;
			error?: undefined;
	  }
	| {
			id: string;
			role: "assistant";
			text: string;
			type: "account";
			data: ProcessedAccount;
			error?: undefined;
	  }
	| {
			id: string;
			role: "assistant";
			text: string;
			type?: undefined;
			data?: undefined;
			error: string;
	  };

const EXAMPLES = [
	"Gasté $350 en gasolina con mi tarjeta BBVA",
	"Me depositaron $15,000 de nómina en BBVA Nómina",
	"Pagué $620 de luz con Efectivo",
];

const TYPE_LABEL: Record<ProcessedTransaction["type"], string> = {
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

		// 1. Guardar copia del texto original
		const previousText = message;

		const userId = crypto.randomUUID();
		setHistory((prev) => [
			...prev,
			{ id: userId, role: "user", text: message },
		]);

		setPrompt(""); // Limpiamos el textarea
		scrollToBottom();

		startTransition(async () => {
			try {
				const result = await processFinancialPrompt(message);

				if (result.success) {
					// Dependiendo del tipo de resultado, agregamos con el tipado correcto
					if (result.type === "transaction") {
						setHistory((prev) => [
							...prev,
							{
								id: crypto.randomUUID(),
								role: "assistant",
								text: result.message,
								type: "transaction",
								data: result.data,
							},
						]);
					} else if (result.type === "budget") {
						setHistory((prev) => [
							...prev,
							{
								id: crypto.randomUUID(),
								role: "assistant",
								text: result.message,
								type: "budget",
								data: result.data,
							},
						]);
					} else if (result.type === "account") {
						setHistory((prev) => [
							...prev,
							{
								id: crypto.randomUUID(),
								role: "assistant",
								text: result.message,
								type: "account",
								data: result.data,
							},
						]);
					}
				} else {
					// Si falla, devolvemos el texto al textarea
					setPrompt(previousText);

					setHistory((prev) => [
						...prev,
						{
							id: crypto.randomUUID(),
							role: "assistant",
							text: result.error,
							error: result.error,
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
							Describe un gasto, ingreso, presupuesto o nueva
							cuenta en lenguaje natural. Lo procesamos
							automáticamente y actualizamos tus finanzas en
							tiempo real.
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
								Ejemplo: “Gasté $350 en gasolina con mi tarjeta
								BBVA”. El modelo extrae monto, categoría y
								cuenta, y guarda el movimiento.
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
											{entry.type === "transaction" && (
												<TransactionCard
													tx={entry.data}
												/>
											)}
											{entry.type === "budget" && (
												<BudgetCard
													budget={entry.data}
												/>
											)}
											{entry.type === "account" && (
												<AccountCard
													account={entry.data}
												/>
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
							Analizando el mensaje y registrando la transacción…
						</div>
					)}
				</div>

				<form
					onSubmit={handleSubmit}
					className="border-t border-gray-800 p-4 bg-[#141416]"
				>
					<div className="flex items-end gap-2">
						<textarea
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									submitPrompt(prompt);
								}
							}}
							placeholder="Escribe un gasto o ingreso…"
							rows={2}
							disabled={isPending}
							className="flex-1 resize-none rounded-xl bg-[#1f1f23] border border-gray-800 p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 disabled:opacity-60"
						/>
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
					{TYPE_LABEL[tx.type]}
				</span>
			</div>
			<div className="grid grid-cols-2 gap-2 text-xs">
				<div className="bg-[#1f1f23] border border-gray-800 rounded-lg p-2.5">
					<span className="text-gray-500 block text-[10px]">
						Descripción
					</span>
					<span className="text-white font-medium">
						{tx.description}
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
						{formatMoney(tx.amount)}
					</span>
				</div>
				<div className="bg-[#1f1f23] border border-gray-800 rounded-lg p-2.5">
					<span className="text-gray-500 block text-[10px]">
						Categoría
					</span>
					<span className="text-white font-medium">
						{tx.category}
					</span>
				</div>
				<div className="bg-[#1f1f23] border border-gray-800 rounded-lg p-2.5">
					<span className="text-gray-500 block text-[10px]">
						Fecha
					</span>
					<span className="text-white font-medium">
						{formatDate(tx.date)}
					</span>
				</div>
				<div className="bg-[#1f1f23] border border-gray-800 rounded-lg p-2.5 col-span-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-gray-400">
							<Wallet size={14} className="text-emerald-400" />
							<span>{tx.accountName}</span>
						</div>
						<span className="text-white font-medium">
							Saldo {formatMoney(tx.accountBalance)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
function BudgetCard({ budget }: { budget: ProcessedBudget }) {
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
					<span className="text-white font-medium">
						{budget.categoria}
					</span>
				</div>
				<div className="bg-[#1f1f23] border border-gray-800 rounded-lg p-2.5">
					<span className="text-gray-500 block text-[10px]">
						Límite Asignado
					</span>
					<span className="text-emerald-400 font-medium">
						{formatMoney(budget.limite)}
					</span>
				</div>
			</div>
		</div>
	);
}

function AccountCard({ account }: { account: ProcessedAccount }) {
	const isCredit = account.type === "credit_card";

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
						{formatMoney(account.balance)}
					</span>
				</div>
			</div>

			{/* Bloque exclusivo para tarjetas de crédito */}
			{isCredit && (
				<div className="grid grid-cols-3 gap-2 pt-1">
					<div className="bg-[#1f1f23] p-2 rounded-lg border border-gray-800">
						<span className="text-gray-500 text-[10px] block">
							Límite Crédito
						</span>
						<span className="text-white font-medium block">
							{account.creditLimit
								? formatMoney(account.creditLimit)
								: "N/A"}
						</span>
					</div>
					<div className="bg-[#1f1f23] p-2 rounded-lg border border-gray-800">
						<span className="text-gray-500 text-[10px] block">
							Día Corte
						</span>
						<span className="text-gray-200 font-medium block">
							{account.cutoffDay
								? `Día ${account.cutoffDay}`
								: "N/A"}
						</span>
					</div>
					<div className="bg-[#1f1f23] p-2 rounded-lg border border-gray-800">
						<span className="text-gray-500 text-[10px] block">
							Límite Pago
						</span>
						<span className="text-gray-200 font-medium block">
							{account.paymentDueDate
								? `Día ${account.paymentDueDate}`
								: "N/A"}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
