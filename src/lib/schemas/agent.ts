import { z } from "zod";

export const AGENT_CATEGORIES = [
	"Alimentación",
	"Transporte",
	"Servicios",
	"Entretenimiento",
	"Salud",
	"Educación",
	"Suscripciones",
	"Vivienda",
	"Ingreso",
	"Transferencia",
	"Otros",
] as const;

export const extractedTransactionSchema = z.object({
	amount: z
		.number()
		.positive()
		.describe("Monto numérico de la transacción, sin símbolos de moneda."),
	type: z
		.enum(["expense", "income", "transfer"])
		.describe(
			"expense = gasto, income = ingreso, transfer = transferencia entre cuentas.",
		),
	category: z
		.string()
		.describe(
			"Categoría corta, p. ej. Alimentación, Transporte, Servicios, Entretenimiento.",
		),
	description: z
		.string()
		.describe("Resumen limpio del gasto, ingreso o transferencia."),
	accountName: z
		.string()
		.describe(
			"Nombre de la cuenta o tarjeta mencionada. Debe coincidir con una cuenta válida del usuario.",
		),
	date: z
		.string()
		.describe(
			"Fecha de la transacción en formato ISO 8601 (YYYY-MM-DD o datetime). Usa la fecha actual si no se menciona otra.",
		),
});

export type ExtractedTransaction = z.infer<typeof extractedTransactionSchema>;
