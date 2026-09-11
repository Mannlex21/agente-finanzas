import Link from "next/link";
import {
	TrendingUp,
	ShieldCheck,
	Sparkles,
	ArrowRight,
	CheckCircle,
	Wallet,
	PieChart,
	BarChart3,
} from "lucide-react";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-[#0d0d0e] text-gray-200 selection:bg-emerald-500/30 selection:text-emerald-400">
			{/* Navbar de la Landing */}
			<header className="border-b border-gray-800/80 bg-[#0d0d0e]/80 backdrop-blur-md sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
					<div className="flex flex-col">
						<span className="font-bold text-white text-2xl tracking-tight leading-none">
							Agente
							<span className="text-emerald-400 font-normal">
								.finanzas
							</span>
						</span>
						<span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase mt-1">
							AI ANALYTICS
						</span>
					</div>

					<div className="flex items-center gap-4">
						<Link
							href="/login"
							className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
						>
							Iniciar Sesión
						</Link>
						<Link
							href="/signup"
							className="bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-sm px-4 py-2 rounded-lg transition shadow-md shadow-emerald-950/40"
						>
							Registrarse gratis
						</Link>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative py-20 lg:py-32 overflow-hidden border-b border-gray-900">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent -z-10" />
				<div className="max-w-7xl mx-auto px-6 text-center space-y-8">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium">
						<Sparkles size={14} />
						<span>
							Monitorea tus finanzas con Inteligencia Artificial
						</span>
					</div>

					<h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
						El copiloto inteligente para tu salud financiera
					</h1>

					<p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed">
						Agente.finanzas combina el poder de la IA y análisis
						avanzado para ayudarte a controlar presupuestos,
						registrar transacciones y maximizar tus ahorros de forma
						totalmente automatizada.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
						<Link
							href="/signup"
							className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-emerald-950/50"
						>
							<span>Comenzar Ahora</span>
							<ArrowRight size={18} />
						</Link>
						<Link
							href="/login"
							className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 font-bold px-8 py-4 rounded-xl text-base transition-all duration-200"
						>
							<span>Acceder a mi panel</span>
						</Link>
					</div>
				</div>
			</section>

			{/* Características principales */}
			<section className="py-20 max-w-7xl mx-auto px-6 space-y-16">
				<div className="text-center space-y-3">
					<h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
						Funcionalidades de Elite
					</h2>
					<p className="text-3xl font-bold text-white tracking-tight">
						Todo lo que necesitas para tu control financiero
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Card 1 */}
					<div className="bg-[#121214] border border-gray-800/60 p-8 rounded-2xl hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between group">
						<div className="space-y-4">
							<div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
								<Sparkles size={24} />
							</div>
							<h3 className="text-xl font-bold text-white">
								Agente IA de Finanzas
							</h3>
							<p className="text-gray-400 text-sm leading-relaxed">
								Conversa con un asistente virtual financiero que
								entiende comandos naturales para registrar
								transacciones, crear presupuestos y analizar
								gastos al instante.
							</p>
						</div>
					</div>

					{/* Card 2 */}
					<div className="bg-[#121214] border border-gray-800/60 p-8 rounded-2xl hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between group">
						<div className="space-y-4">
							<div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
								<PieChart size={24} />
							</div>
							<h3 className="text-xl font-bold text-white">
								Gestión de Presupuestos
							</h3>
							<p className="text-gray-400 text-sm leading-relaxed">
								Asigna límites inteligentes por categorías de
								consumo. Recibe alertas y reportes para asegurar
								que te mantengas siempre por debajo de tu límite
								de gastos.
							</p>
						</div>
					</div>

					{/* Card 3 */}
					<div className="bg-[#121214] border border-gray-800/60 p-8 rounded-2xl hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between group">
						<div className="space-y-4">
							<div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
								<Wallet size={24} />
							</div>
							<h3 className="text-xl font-bold text-white">
								Cuentas y Tarjetas
							</h3>
							<p className="text-gray-400 text-sm leading-relaxed">
								Administra múltiples billeteras de efectivo,
								cuentas corrientes, tarjetas de crédito y
								ahorros en un único dashboard unificado en
								tiempo real.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Seguridad */}
			<section className="bg-[#121214] border-y border-gray-800/60 py-20">
				<div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<div className="space-y-6">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium">
							<ShieldCheck size={14} />
							<span>Seguridad Garantizada</span>
						</div>
						<h2 className="text-3xl font-bold text-white tracking-tight">
							Tus datos están protegidos con autenticación militar
							de Supabase
						</h2>
						<p className="text-gray-400 leading-relaxed">
							Nos tomamos en serio la privacidad de tus finanzas.
							Todo el flujo de inicio de sesión y almacenamiento
							de datos está resguardado mediante estándares de
							encriptación avanzados y aislamiento de inquilinos
							de Supabase Auth.
						</p>
						<ul className="space-y-3">
							<li className="flex items-center gap-2 text-sm text-gray-300">
								<CheckCircle
									size={16}
									className="text-emerald-400"
								/>
								<span>
									Doble factor de autenticación opcional
								</span>
							</li>
							<li className="flex items-center gap-2 text-sm text-gray-300">
								<CheckCircle
									size={16}
									className="text-emerald-400"
								/>
								<span>
									Políticas de protección de datos de nivel
									bancario
								</span>
							</li>
							<li className="flex items-center gap-2 text-sm text-gray-300">
								<CheckCircle
									size={16}
									className="text-emerald-400"
								/>
								<span>
									Desconexión automática y control de sesiones
									seguras
								</span>
							</li>
						</ul>
					</div>
					<div className="relative aspect-video rounded-2xl bg-gradient-to-br from-emerald-950/30 to-blue-950/20 border border-gray-800 flex items-center justify-center overflow-hidden">
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
						<BarChart3
							size={64}
							className="text-emerald-500/40 animate-pulse"
						/>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-gray-900 py-12 bg-[#080809]">
				<div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
					<div className="flex flex-col items-center sm:items-start">
						<span className="font-bold text-white text-lg tracking-tight">
							Agente
							<span className="text-emerald-400 font-normal">
								.finanzas
							</span>
						</span>
						<span className="text-[9px] font-mono text-gray-500 tracking-wider uppercase mt-0.5">
							© 2026 Agente Finanzas. Todos los derechos
							reservados.
						</span>
					</div>
					<div className="flex items-center gap-6 text-sm text-gray-400">
						<Link
							href="/login"
							className="hover:text-white transition-colors"
						>
							Entrar
						</Link>
						<Link
							href="/signup"
							className="hover:text-white transition-colors"
						>
							Crear Cuenta
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
