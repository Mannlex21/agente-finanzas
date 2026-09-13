// src/app/(dashboard)/components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	CreditCard,
	Wallet,
	PieChart,
	Settings,
	X,
	Sparkles,
} from "lucide-react";

interface SidebarProps {
	mobileOpen: boolean;
	setMobileOpen: (open: boolean) => void;
	desktopCollapsed: boolean;
}

export const navigationItems = [
	{ name: "Resumen", href: "/dashboard", icon: LayoutDashboard },
	{ name: "Cuentas y Tarjetas", href: "/accounts", icon: CreditCard },
	{ name: "Transacciones", href: "/transactions", icon: Wallet },
	{ name: "Presupuestos", href: "/budgets", icon: PieChart },
	{ name: "Configuración", href: "/settings", icon: Settings },
];

export function Sidebar({
	mobileOpen,
	setMobileOpen,
	desktopCollapsed,
}: SidebarProps) {
	const pathname = usePathname();

	return (
		<>
			{/* Overlay traslúcido para móvil */}
			{mobileOpen && (
				<div
					className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
					onClick={() => setMobileOpen(false)}
				/>
			)}

			{/* Contenedor del Sidebar */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 bg-[#141416] border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out
				${
					/* Comportamiento en Móvil */
					mobileOpen ? "translate-x-0 w-64" : "-translate-x-full"
				}
				${
					/* Comportamiento en Escritorio */
					desktopCollapsed ? "lg:w-16" : "lg:w-64"
				} lg:translate-x-0`}
			>
				{/* Header del Sidebar */}
				<div className="h-16 border-b border-gray-800 px-4 flex items-center justify-between overflow-hidden shrink-0">
					<div className="flex items-center gap-3">
						<div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
							A
						</div>
						<div
							className={`flex flex-col whitespace-nowrap transition-opacity duration-200 ${
								desktopCollapsed ? "lg:hidden" : "block"
							}`}
						>
							<span className="font-bold text-white text-lg tracking-tight leading-none">
								Agente
								<span className="text-emerald-400 font-normal">
									.finanzas
								</span>
							</span>
							<span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase mt-0.5">
								AI ANALYTICS
							</span>
						</div>
					</div>

					{/* Botón Cerrar (Móvil) */}
					<button
						onClick={() => setMobileOpen(false)}
						className="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg"
					>
						<X size={20} />
					</button>
				</div>

				{/* Botón Agente IA */}
				<div className="p-3 border-b border-gray-800 shrink-0">
					<Link
						href="/ai-agent"
						onClick={() => setMobileOpen(false)}
						className={`flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-black font-medium py-2 rounded-lg text-sm transition shadow-sm ${
							desktopCollapsed
								? "w-full lg:w-10 lg:h-10 lg:p-0 lg:mx-auto"
								: "w-full px-3"
						}`}
						title="Agente IA"
					>
						<Sparkles size={16} className="flex-shrink-0" />
						<span
							className={
								desktopCollapsed ? "lg:hidden" : "inline"
							}
						>
							Agente IA
						</span>
					</Link>
				</div>

				{/* Navigation Links */}
				<div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
					<div
						className={`text-[10px] font-semibold text-gray-500 uppercase px-3 mb-2 tracking-wider ${
							desktopCollapsed ? "lg:hidden" : "block"
						}`}
					>
						General
					</div>

					{navigationItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setMobileOpen(false)}
								title={desktopCollapsed ? item.name : undefined}
								className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
									desktopCollapsed ? "lg:justify-center" : ""
								} ${
									isActive
										? "bg-[#27272a] text-emerald-400 border border-gray-700/50"
										: "text-gray-400 hover:bg-[#1f1f23] hover:text-gray-200"
								}`}
							>
								<Icon size={18} className="flex-shrink-0" />
								<span
									className={`truncate whitespace-nowrap ${
										desktopCollapsed
											? "lg:hidden"
											: "inline"
									}`}
								>
									{item.name}
								</span>
							</Link>
						);
					})}
				</div>
			</aside>
		</>
	);
}
