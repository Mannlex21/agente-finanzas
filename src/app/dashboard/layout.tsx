"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "../../lib/supabase/client";
import {
	LayoutDashboard,
	CreditCard,
	Wallet,
	PieChart,
	Settings,
	Bell,
	X,
	Sparkles,
	Menu,
	LogOut,
	User,
	HelpCircle,
	ChevronDown,
	PanelLeftClose,
	PanelLeft,
} from "lucide-react";
import { AccountModal } from "../components/AccountModal";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const supabase = createClient();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const [user, setUser] = useState<SupabaseUser | null>(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const navigationItems = [
		{ name: "Resumen", href: "/dashboard", icon: LayoutDashboard },
		{
			name: "Cuentas y Tarjetas",
			href: "/dashboard/accounts",
			icon: CreditCard,
		},
		{
			name: "Transacciones",
			href: "/dashboard/transactions",
			icon: Wallet,
		},
		{ name: "Presupuestos", href: "/dashboard/budgets", icon: PieChart },
		{ name: "Configuración", href: "/dashboard/settings", icon: Settings },
	];

	useEffect(() => {
		async function getProfile() {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				setUser(user);
			}
		}
		getProfile();
	}, [supabase]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.push("/login");
		router.refresh();
	};

	const userEmail = user?.email || "usuario@finanzas.com";
	const userName =
		user?.user_metadata?.full_name ||
		user?.email?.split("@")[0] ||
		"Usuario";
	const userInitials =
		userName
			.split(" ")
			.map((n: string) => n[0])
			.join("")
			.substring(0, 2)
			.toUpperCase() || "US";

	return (
		<div className="min-h-screen bg-[#1c1c1e] text-gray-200 flex">
			{/* Sidebar Lateral Adaptable */}
			<aside
				className={`fixed inset-y-0 left-0 z-40 bg-[#141416] border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out ${
					sidebarOpen ? "w-64" : "w-16"
				}`}
			>
				{/* Header del Sidebar (Logo siempre visible) */}
				<div className="h-16 border-b border-gray-800 px-4 flex items-center justify-between overflow-hidden">
					<div className="flex items-center gap-3">
						<div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
							A
						</div>
						{sidebarOpen && (
							<div className="flex flex-col whitespace-nowrap transition-opacity duration-200">
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
						)}
					</div>

					<button
						onClick={() => setSidebarOpen(false)}
						className="lg:hidden text-gray-400 hover:text-white"
					>
						<X size={20} />
					</button>
				</div>

				{/* Botón Agente IA */}
				<div className="p-3 border-b border-gray-800">
					<Link
						href="/dashboard/ai-agent"
						className={`flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-black font-medium py-2 rounded-lg text-sm transition shadow-sm ${
							sidebarOpen
								? "w-full px-3"
								: "w-10 h-10 p-0 mx-auto"
						}`}
						title="Agente IA"
					>
						<Sparkles size={16} className="flex-shrink-0" />
						{sidebarOpen && <span>Agente IA</span>}
					</Link>
				</div>

				{/* Links de Navegación */}
				<div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
					{sidebarOpen && (
						<div className="text-[10px] font-semibold text-gray-500 uppercase px-3 mb-2 tracking-wider">
							General
						</div>
					)}
					{navigationItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								title={!sidebarOpen ? item.name : undefined}
								className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
									sidebarOpen ? "" : "justify-center"
								} ${
									isActive
										? "bg-[#27272a] text-emerald-400 border border-gray-700/50"
										: "text-gray-400 hover:bg-[#1f1f23] hover:text-gray-200"
								}`}
							>
								<Icon size={18} className="flex-shrink-0" />
								{sidebarOpen && (
									<span className="truncate whitespace-nowrap">
										{item.name}
									</span>
								)}
							</Link>
						);
					})}
				</div>
			</aside>

			{/* Contenedor Principal (Sincronizado dinámicamente con pl-64 / pl-16) */}
			<div
				className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
					sidebarOpen ? "lg:pl-64" : "lg:pl-16"
				}`}
			>
				{/* Navbar Superior */}
				<header className="h-16 border-b border-gray-800 bg-[#141416]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
					<div className="flex items-center gap-4">
						{/* Toggle para Móvil */}
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className="lg:hidden text-gray-400 hover:text-white"
						>
							<Menu size={22} />
						</button>

						{/* Toggle para Escritorio */}
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className="hidden lg:flex items-center text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#1f1f23] transition-colors"
							title={
								sidebarOpen ? "Colapsar menú" : "Expandir menú"
							}
						>
							{sidebarOpen ? (
								<PanelLeftClose size={20} />
							) : (
								<PanelLeft size={20} />
							)}
						</button>
					</div>

					{/* Elementos Derechos del Navbar */}
					<div className="flex items-center gap-4">
						<button className="text-gray-400 hover:text-white relative p-1.5 rounded-lg hover:bg-[#1f1f23]">
							<Bell size={18} />
						</button>

						{/* Dropdown de Perfil */}
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={() => setDropdownOpen(!dropdownOpen)}
								className="flex items-center gap-3 pl-2 border-l border-gray-800 hover:opacity-90 transition focus:outline-none"
							>
								<div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
									{userInitials}
								</div>
								<div className="hidden sm:block text-left">
									<div className="text-xs font-medium text-white flex items-center gap-1">
										<span>{userName}</span>
										<ChevronDown
											size={12}
											className="text-gray-400"
										/>
									</div>
									<div className="text-[10px] text-emerald-400">
										PRO Plan
									</div>
								</div>
							</button>

							{/* Menú Desplegable */}
							{dropdownOpen && (
								<div className="absolute right-0 mt-2.5 w-56 bg-[#141416] border border-gray-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
									<div className="px-4 py-2 border-b border-gray-800">
										<p className="text-xs font-medium text-white truncate">
											{userName}
										</p>
										<p className="text-[10px] text-gray-400 truncate mt-0.5">
											{userEmail}
										</p>
									</div>

									<div className="py-1">
										<Link
											href="/dashboard/settings"
											onClick={() =>
												setDropdownOpen(false)
											}
											className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:bg-[#1f1f23] hover:text-white transition-colors"
										>
											<User
												size={14}
												className="text-gray-400"
											/>
											<span>Perfil / Ajustes</span>
										</Link>
										<Link
											href="/dashboard/settings"
											onClick={() =>
												setDropdownOpen(false)
											}
											className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:bg-[#1f1f23] hover:text-white transition-colors"
										>
											<HelpCircle
												size={14}
												className="text-gray-400"
											/>
											<span>Soporte & Doc</span>
										</Link>
									</div>

									<div className="border-t border-gray-800 my-1"></div>

									<div className="py-1">
										<button
											onClick={() => {
												setDropdownOpen(false);
												handleSignOut();
											}}
											className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors text-left"
										>
											<LogOut size={14} />
											<span>Cerrar Sesión</span>
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</header>

				{/* Contenido Central Dinámico */}
				<main className="flex-1 p-6 lg:p-10 bg-[#121214] overflow-y-auto">
					{children}
				</main>
			</div>

			<AccountModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
}
