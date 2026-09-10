"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	CreditCard,
	Wallet,
	PieChart,
	Settings,
	Search,
	Bell,
	Menu,
	X,
	Sparkles,
} from "lucide-react";
import { AccountModal } from "../components/AccountModal";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const navigationItems = [
		{ name: "Resumen", href: "/dashboard", icon: LayoutDashboard },
		{
			name: "Cuentas y Tarjetas",
			href: "/dashboard/accounts",
			icon: CreditCard,
		},
		{ name: "Agente IA", href: "/dashboard/ai-agent", icon: Sparkles }, // <--- Añadido aquí
		{
			name: "Transacciones",
			href: "/dashboard/transactions",
			icon: Wallet,
		},
		{ name: "Presupuestos", href: "/dashboard/budgets", icon: PieChart },
		{ name: "Configuración", href: "/dashboard/settings", icon: Settings },
	];

	return (
		<div className="min-h-screen bg-[#1c1c1e] text-gray-200 flex">
			{/* Sidebar Lateral Estilo Supabase */}
			<aside
				className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#141416] border-r border-gray-800 flex flex-col transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
			>
				{/* Logo / Selector de Proyecto */}
				<div className="h-16 border-b border-gray-800 px-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black text-sm">
							AF
						</div>
						<span className="font-semibold text-white tracking-wide">
							agente-finanzas
						</span>
					</div>
					<button
						onClick={() => setSidebarOpen(false)}
						className="lg:hidden text-gray-400 hover:text-white"
					>
						<X size={20} />
					</button>
				</div>

				{/* Links de Navegación */}
				<div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
					<div className="text-xs font-semibold text-gray-500 uppercase px-3 mb-2 tracking-wider">
						General
					</div>
					{navigationItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
									isActive
										? "bg-[#27272a] text-emerald-400 border border-gray-700/50"
										: "text-gray-400 hover:bg-[#1f1f23] hover:text-gray-200"
								}`}
							>
								<Icon size={18} />
								{item.name}
							</Link>
						);
					})}
				</div>

				{/* Footer del Sidebar */}
				<div className="p-4 border-t border-gray-800">
					<button
						onClick={() => setIsModalOpen(true)}
						className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-medium py-2 rounded-lg text-sm transition shadow-sm"
					>
						+ Nueva Transacción
					</button>
				</div>
			</aside>

			{/* Contenedor Principal (Navbar + Contenido) */}
			<div className="flex-1 lg:pl-64 flex flex-col min-w-0">
				{/* Navbar Superior */}
				<header className="h-16 border-b border-gray-800 bg-[#141416]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
					<div className="flex items-center gap-4">
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className="lg:hidden text-gray-400 hover:text-white"
						>
							<Menu size={22} />
						</button>
						<div className="flex items-center gap-2 text-sm text-gray-400">
							<span className="text-white font-medium">
								Workspace
							</span>
							<span>/</span>
							<span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/50 text-xs">
								PRODUCTION
							</span>
						</div>
					</div>

					{/* Elementos Derechos del Navbar (Buscador, Notificaciones y Perfil de Usuario) */}
					<div className="flex items-center gap-4">
						<div className="hidden md:flex items-center gap-2 bg-[#1f1f23] border border-gray-800 px-3 py-1.5 rounded-lg text-xs text-gray-400">
							<Search size={14} />
							<span>Buscar comandos...</span>
							<kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-[10px] text-gray-300">
								Ctrl K
							</kbd>
						</div>

						<button className="text-gray-400 hover:text-white relative p-1.5 rounded-lg hover:bg-[#1f1f23]">
							<Bell size={18} />
						</button>

						<div className="flex items-center gap-3 pl-2 border-l border-gray-800">
							<div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
								MA
							</div>
							<div className="hidden sm:block text-left">
								<div className="text-xs font-medium text-white">
									Manuel Murillo
								</div>
								<div className="text-[10px] text-emerald-400">
									PRO Plan
								</div>
							</div>
						</div>
					</div>
				</header>

				{/* Contenido Central Dinámico que inyecta cada sub-página */}
				<main className="flex-1 p-6 lg:p-10 bg-[#121214] overflow-y-auto">
					{children}
				</main>
			</div>

			{/* Modal global de cuentas */}
			<AccountModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
}
