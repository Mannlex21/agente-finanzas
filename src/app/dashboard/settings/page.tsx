"use client";

import React, { useState } from "react";
import {
	Settings,
	Moon,
	DollarSign,
	Bell,
	Shield,
	Download,
	Trash2,
	Info,
	ChevronRight,
} from "lucide-react";

export default function SettingsPage() {
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [darkMode, setDarkMode] = useState(true);
	const [currency, setCurrency] = useState("MXN ($)");

	const handleExportData = () => {
		alert(
			"Tus registros financieros se han exportado en formato CSV exitosamente.",
		);
	};

	const handleResetData = () => {
		if (
			confirm(
				"¿Estás seguro de que deseas borrar todos los registros? Esta acción no se puede deshacer.",
			)
		) {
			console.log("Datos borrados");
		}
	};

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			{/* Encabezado Principal */}
			<div className="bg-[#17171a] border border-gray-800 rounded-xl p-6 shadow-sm flex items-center gap-4">
				<div className="p-3 bg-gray-800 text-gray-300 rounded-xl border border-gray-700">
					<Settings size={24} />
				</div>
				<div>
					<h1 className="text-xl font-bold text-white tracking-tight">
						Configuración
					</h1>
					<p className="text-xs text-gray-400 mt-0.5">
						Administra las preferencias generales, seguridad y datos
						de tu sistema.
					</p>
				</div>
			</div>

			{/* Sección: Preferencias */}
			<div className="space-y-3">
				<h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
					Preferencias
				</h2>
				<div className="bg-[#17171a] border border-gray-800 rounded-xl divide-y divide-gray-800 shadow-sm">
					{/* Modo Oscuro */}
					<div className="flex items-center justify-between p-4">
						<div className="flex items-center gap-3">
							<Moon size={18} className="text-emerald-400" />
							<span className="text-sm text-gray-200 font-medium">
								Modo Oscuro
							</span>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={darkMode}
								onChange={() => setDarkMode(!darkMode)}
								className="sr-only peer"
							/>
							<div className="w-9 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
						</label>
					</div>

					{/* Moneda Principal */}
					<div
						onClick={() =>
							alert("Selecciona tu moneda predeterminada")
						}
						className="flex items-center justify-between p-4 hover:bg-[#1f1f23] transition cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<DollarSign
								size={18}
								className="text-emerald-400"
							/>
							<span className="text-sm text-gray-200 font-medium">
								Moneda Principal
							</span>
						</div>
						<div className="flex items-center gap-2 text-gray-400 text-xs">
							<span>{currency}</span>
							<ChevronRight size={16} />
						</div>
					</div>
				</div>
			</div>

			{/* Sección: Seguridad y Alertas */}
			<div className="space-y-3">
				<h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
					Seguridad y Alertas
				</h2>
				<div className="bg-[#17171a] border border-gray-800 rounded-xl divide-y divide-gray-800 shadow-sm">
					<div className="flex items-center justify-between p-4">
						<div className="flex items-center gap-3">
							<Bell size={18} className="text-emerald-400" />
							<span className="text-sm text-gray-200 font-medium">
								Notificaciones de Gastos
							</span>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={notificationsEnabled}
								onChange={() =>
									setNotificationsEnabled(
										!notificationsEnabled,
									)
								}
								className="sr-only peer"
							/>
							<div className="w-9 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
						</label>
					</div>
				</div>
			</div>

			{/* Sección: Gestión de Datos */}
			<div className="space-y-3">
				<h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
					Gestión de Datos
				</h2>
				<div className="bg-[#17171a] border border-gray-800 rounded-xl divide-y divide-gray-800 shadow-sm">
					<div
						onClick={handleExportData}
						className="flex items-center justify-between p-4 hover:bg-[#1f1f23] transition cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<Download size={18} className="text-emerald-400" />
							<span className="text-sm text-gray-200 font-medium">
								Exportar Registros (CSV)
							</span>
						</div>
						<ChevronRight size={16} className="text-gray-500" />
					</div>

					<div
						onClick={handleResetData}
						className="flex items-center justify-between p-4 hover:bg-[#1f1f23] transition cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<Trash2 size={18} className="text-red-400" />
							<span className="text-sm text-red-400 font-medium">
								Restablecer Datos
							</span>
						</div>
						<ChevronRight size={16} className="text-gray-500" />
					</div>
				</div>
			</div>

			{/* Sección: Acerca de */}
			<div className="space-y-3">
				<h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
					Acerca de
				</h2>
				<div className="bg-[#17171a] border border-gray-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Info size={18} className="text-emerald-400" />
						<span className="text-sm text-gray-200 font-medium">
							Versión del Sistema
						</span>
					</div>
					<span className="text-xs text-gray-400 bg-[#1f1f23] px-2 py-1 rounded border border-gray-800">
						v1.0.4-prod
					</span>
				</div>
			</div>
		</div>
	);
}
