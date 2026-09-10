"use client";

import React, { useState } from "react";
import { CATEGORIAS_FINANZAS, Transaccion } from "@/lib/schemas/finanzas";
import { Sparkles, ArrowRight, AlertTriangle } from "lucide-react";

export default function Home() {
	const [prompt, setPrompt] = useState("");
	const [loading, setLoading] = useState(false);
	const [transaccion, setTransaccion] = useState<Partial<Transaccion> | null>(
		null,
	);
	const [rawText, setRawText] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!prompt.trim()) return;

		setLoading(true);
		setTransaccion(null);
		setRawText("");

		try {
			const response = await fetch("/api/transacciones/parse", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt }),
			});

			if (!response.ok || !response.body) {
				throw new Error("Error al procesar la transacción");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let accumulatedText = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value, { stream: true });
				accumulatedText += chunk;
				setRawText(accumulatedText);

				try {
					const parsed = JSON.parse(accumulatedText);
					setTransaccion(parsed);
				} catch {
					// El JSON aún está incompleto por el streaming
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			{/* Encabezado */}
			<div className="bg-[#17171a] border border-gray-800 rounded-xl p-6 shadow-sm flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="p-3 bg-emerald-950/50 text-emerald-400 rounded-xl border border-emerald-900/50">
						<Sparkles size={24} />
					</div>
					<div>
						<h1 className="text-xl font-bold text-white tracking-tight">
							Agente de Finanzas con IA
						</h1>
						<p className="text-xs text-gray-400 mt-0.5">
							Escribe tu gasto o ingreso en lenguaje natural y la
							IA lo estructurará automáticamente.
						</p>
					</div>
				</div>
			</div>

			{/* Formulario y Tarjeta de Resultado */}
			<div className="bg-[#17171a] border border-gray-800 rounded-xl p-6 shadow-sm space-y-6">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-xs font-medium text-gray-400 mb-2">
							Descripción de la transacción
						</label>
						<textarea
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							placeholder="Ej. Compré despensa en el Walmart por 1,250 pesos con tarjeta de crédito..."
							rows={3}
							className="w-full rounded-xl bg-[#1f1f23] border border-gray-800 p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 text-sm"
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-black disabled:opacity-50 font-medium rounded-xl transition-colors cursor-pointer text-sm flex items-center justify-center gap-2 shadow-sm"
					>
						{loading ? (
							"Analizando transacción..."
						) : (
							<>
								Procesar con IA <ArrowRight size={16} />
							</>
						)}
					</button>
				</form>

				{/* Tarjeta de resultado estructurado */}
				{(transaccion || rawText) && (
					<div className="rounded-xl bg-[#141416] border border-gray-800 p-5 space-y-4 animate-in fade-in duration-200">
						<h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
							Resultado Extraído
						</h2>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
							<div className="bg-[#1f1f23] p-3 rounded-lg border border-gray-800">
								<span className="text-gray-400 block text-[11px]">
									Comercio
								</span>
								<span className="font-medium text-white">
									{transaccion?.comercio || "Analizando..."}
								</span>
							</div>
							<div className="bg-[#1f1f23] p-3 rounded-lg border border-gray-800">
								<span className="text-gray-400 block text-[11px]">
									Monto
								</span>
								<span className="font-medium text-white">
									{transaccion?.monto
										? `$${transaccion.monto}`
										: "---"}
								</span>
							</div>
							<div className="bg-[#1f1f23] p-3 rounded-lg border border-gray-800">
								<span className="text-gray-400 block text-[11px]">
									Categoría
								</span>
								<span className="font-medium text-white">
									{transaccion?.categoria || "---"}
								</span>
							</div>
							<div className="bg-[#1f1f23] p-3 rounded-lg border border-gray-800">
								<span className="text-gray-400 block text-[11px]">
									Tipo
								</span>
								<span className="capitalize font-medium text-white">
									{transaccion?.tipo || "---"}
								</span>
							</div>
						</div>

						{transaccion?.alertaPresupuesto && (
							<div className="bg-amber-950/30 border border-amber-900/50 p-3 rounded-lg text-amber-300 text-xs flex items-center gap-2">
								<AlertTriangle size={16} />
								<span>{transaccion.alertaPresupuesto}</span>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
