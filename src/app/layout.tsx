import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AccountProvider } from "@/context/AccountContext";

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
				<AccountProvider>{children}</AccountProvider>
			</body>
		</html>
	);
}
