import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Agente Finanzas",
	description: "Panel de control financiero personal",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="es" className="dark">
			<body
				className={`${inter.className} bg-[#121214] text-gray-100 antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
