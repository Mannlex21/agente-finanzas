"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import { KeyRound, Mail, Sparkles, Loader2, ArrowRight } from "lucide-react";

export default function SignUpPage() {
	const router = useRouter();
	const supabase = createClient();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		const { data, error: signUpError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: fullName,
				},
			},
		});

		if (signUpError) {
			setError(signUpError.message);
			setLoading(false);
		} else {
			setSuccess(
				"¡Registro exitoso! Por favor, revisa tu correo para verificar tu cuenta (o inicia sesión si la confirmación de correo está desactivada).",
			);
			setLoading(false);
			setEmail("");
			setPassword("");
			setFullName("");
		}
	};

	return (
		<div className="min-h-screen bg-[#0d0d0e] text-gray-200 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent -z-10" />

			<div className="w-full max-w-md space-y-8 bg-[#121214] border border-gray-800/80 p-8 rounded-2xl shadow-xl">
				{/* Encabezado */}
				<div className="text-center space-y-2">
					<Link href="/" className="inline-block">
						<div className="flex flex-col items-center">
							<span className="font-bold text-white text-3xl tracking-tight leading-none">
								Agente
								<span className="text-emerald-400 font-normal">
									.finanzas
								</span>
							</span>
							<span className="text-[9px] font-mono text-gray-400 tracking-widest uppercase mt-1">
								AI ANALYTICS
							</span>
						</div>
					</Link>
					<h2 className="text-xl font-bold text-white tracking-tight pt-4">
						Crea tu cuenta gratis
					</h2>
					<p className="text-xs text-gray-400">
						Regístrate hoy y toma el control inteligente de tu
						dinero.
					</p>
				</div>

				{/* Error Alert */}
				{error && (
					<div className="bg-red-950/40 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs font-medium text-center">
						{error}
					</div>
				)}

				{/* Success Alert */}
				{success && (
					<div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-xs font-medium text-center">
						{success}
					</div>
				)}

				{/* Formulario */}
				<form onSubmit={handleSignUp} className="space-y-4">
					<div>
						<label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
							Nombre completo
						</label>
						<input
							type="text"
							required
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							className="w-full px-4 py-3 bg-[#17171a] border border-gray-800 rounded-xl text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-600"
							placeholder="Juan Pérez"
						/>
					</div>

					<div>
						<label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
							Correo electrónico
						</label>
						<div className="relative">
							<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
								<Mail size={16} />
							</span>
							<input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full pl-10 pr-4 py-3 bg-[#17171a] border border-gray-800 rounded-xl text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-600"
								placeholder="nombre@ejemplo.com"
							/>
						</div>
					</div>

					<div>
						<label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
							Contraseña
						</label>
						<div className="relative">
							<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
								<KeyRound size={16} />
							</span>
							<input
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full pl-10 pr-4 py-3 bg-[#17171a] border border-gray-800 rounded-xl text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-600"
								placeholder="Mínimo 6 caracteres"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:text-gray-400 text-black font-bold py-3 px-4 rounded-xl text-sm transition-colors duration-200 shadow-md shadow-emerald-950/40"
					>
						{loading ? (
							<>
								<Loader2 size={16} className="animate-spin" />
								<span>Creando cuenta...</span>
							</>
						) : (
							<>
								<span>Crear Cuenta</span>
								<ArrowRight size={16} />
							</>
						)}
					</button>
				</form>

				<div className="text-center pt-2">
					<p className="text-xs text-gray-400">
						¿Ya tienes una cuenta?{" "}
						<Link
							href="/login"
							className="text-emerald-400 font-medium hover:underline"
						>
							Inicia sesión aquí
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
