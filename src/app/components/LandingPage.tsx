import Link from "next/link";
import { Bot, Wallet, ArrowRight, PieChart, Zap } from "lucide-react";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-[#0d0d0f] text-gray-100 flex flex-col selection:bg-emerald-500 selection:text-black">
			{/* Navbar */}
			<header className="border-b border-gray-800/80 bg-[#141416]/60 backdrop-blur-md sticky top-0 z-50">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
					{/* Logo & Subtítulo */}
					<div className="flex flex-col whitespace-nowrap shrink-0">
						<span className="font-bold text-white text-base sm:text-xl tracking-tight leading-none">
							Agente
							<span className="text-emerald-400 font-normal">
								.finanzas
							</span>
						</span>
						<span className="text-[9px] sm:text-xs font-mono text-gray-400 tracking-widest uppercase mt-0.5">
							AI ANALYTICS
						</span>
					</div>

					{/* Botones de acción */}
					<div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
						<Link
							href="/login"
							className="text-xs text-gray-400 hover:text-white transition font-medium px-2.5 py-2 whitespace-nowrap"
						>
							Iniciar sesión
						</Link>
						<Link
							href="/login"
							className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-black px-3 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-emerald-950/20 whitespace-nowrap"
						>
							<span>Comenzar</span>
							<span className="hidden sm:inline">gratis</span>
							<ArrowRight size={14} className="shrink-0" />
						</Link>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative overflow-hidden pt-24 pb-20 px-6 text-center">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-950/30 via-transparent to-transparent -z-10" />

				<div className="max-w-4xl mx-auto space-y-6">
					<div className="inline-flex items-center gap-2 px-3 bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 rounded-full text-xs font-medium">
						<Bot size={14} />
						<span>Potenciado con Inteligencia Artificial</span>
					</div>

					<h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
						Toma el control de tus finanzas{" "}
						<br className="hidden sm:inline" />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
							tan fácil como enviar un mensaje
						</span>
					</h1>

					<p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
						Olvídate de las hojas de cálculo complejas. Registra
						gastos por voz o texto, gestiona tus tarjetas de crédito
						con sus fechas de corte y visualiza tu dinero en tiempo
						real.
					</p>

					<div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
						<Link
							href="/login"
							className="w-full sm:w-auto text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-black px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
						>
							Probar Agente IA
							<ArrowRight size={16} />
						</Link>
					</div>
				</div>

				{/* Mockup / Preview Card */}
				<div className="max-w-3xl mx-auto mt-14 bg-[#17171a] border border-gray-800 rounded-2xl p-4 shadow-2xl relative">
					<div className="bg-[#141416] border border-gray-800/80 rounded-xl p-4 text-left space-y-3">
						<div className="flex items-center gap-2 text-xs text-emerald-400">
							<Bot size={16} />
							<span className="font-semibold">
								Agente IA en acción
							</span>
						</div>
						<div className="bg-[#1f1f23] border border-gray-800 rounded-lg p-3 text-xs text-gray-300">
							Gasté $350 en gasolina con mi tarjeta BBVA hoy
						</div>
						<div className="bg-emerald-950/20 border border-emerald-900/50 rounded-lg p-3 text-xs text-emerald-300 flex items-center justify-between">
							<span>
								✓ Transacción registrada en Transporte ($350.00
								MXN)
							</span>
							<span className="text-[10px] text-emerald-500 font-mono">
								BBVA
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="py-16 border-t border-gray-800/60 bg-[#111113]">
				<div className="max-w-6xl mx-auto px-6">
					<div className="text-center max-w-xl mx-auto mb-12">
						<h2 className="text-2xl font-bold text-white">
							Todo lo que necesitas para tu dinero
						</h2>
						<p className="text-xs text-gray-400 mt-2">
							Diseñado para simplificar tu registro diario sin
							perder precisión.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<FeatureCard
							icon={
								<Zap className="text-emerald-400" size={20} />
							}
							title="Entrada en Lenguaje Natural"
							description="Escribe o dicta tus movimientos como si hablaras con un amigo. La IA extrae montos, fechas y categorías automáticamente."
						/>
						<FeatureCard
							icon={
								<Wallet
									className="text-emerald-400"
									size={20}
								/>
							}
							title="Control de Tarjetas de Crédito"
							description="Administra fechas de corte y límites de pago para saber exactamente cuánto pagar en cada periodo sin sorpresas."
						/>
						<FeatureCard
							icon={
								<PieChart
									className="text-emerald-400"
									size={20}
								/>
							}
							title="Presupuestos Inteligentes"
							description="Define límites de gasto por categoría y recibe seguimiento claro del estado de tus metas mensuales."
						/>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="mt-auto border-t border-gray-800/80 py-8 text-center text-xs text-gray-500">
				<div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p>
						© {new Date().getFullYear()} Manuel Alejandro Murillo
						Macias. Todos los derechos reservados.
					</p>
					<div className="flex gap-4">
						<Link
							href="/login"
							className="hover:text-gray-300 transition"
						>
							Iniciar Sesión
						</Link>
						<Link
							href="/login"
							className="hover:text-gray-300 transition"
						>
							Registrarse
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="bg-[#17171a] border border-gray-800 rounded-xl p-6 space-y-3 hover:border-gray-700 transition">
			<div className="p-2.5 bg-[#1f1f23] border border-gray-800 rounded-lg w-fit">
				{icon}
			</div>
			<h3 className="text-base font-semibold text-white">{title}</h3>
			<p className="text-xs text-gray-400 leading-relaxed">
				{description}
			</p>
		</div>
	);
}
