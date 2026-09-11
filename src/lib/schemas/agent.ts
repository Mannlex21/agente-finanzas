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
export const createTransactionSchema = z.object({
	comercio: z
		.string()
		.describe("Establecimiento o concepto de la transacción"),
	monto: z
		.number()
		.positive()
		.describe("Monto numérico exacto de la transacción"),
	categoria: z
		.string()
		.describe(
			"Categoría de la transacción (p. ej. Alimentación, Transporte, Servicios)",
		),
	tipo: z
		.enum(["gasto", "ingreso"])
		.describe("Tipo de transacción: gasto o ingreso"),
	accountName: z
		.string()
		.describe(
			"Nombre de la cuenta financiera donde se realiza el movimiento",
		),
});

export const createBudgetSchema = z.object({
	categoria: z
		.string()
		.describe(
			"Categoría para asignar el presupuesto (p. ej. Alimentación, Servicios de IA)",
		),
	limite: z
		.number()
		.optional()
		.describe(
			"Límite máximo de gasto. Si el usuario no especificó un monto, déjalo undefined.",
		),
});

export const createAccountSchema = z.object({
	name: z
		.string()
		.describe(
			"Nombre descriptivo para la cuenta (p. ej. Tarjeta Oro Banamex)",
		),
	type: z
		.enum(["debit_card", "credit_card", "cash", "savings"])
		.describe("Tipo de cuenta financiera"),
	balance: z
		.number()
		.default(0)
		.describe("Saldo o deuda inicial de la cuenta (por defecto 0)"),
	creditLimit: z
		.number()
		.optional()
		.describe("Límite de crédito total si el tipo es credit_card"),
	cutoffDay: z
		.number()
		.min(1)
		.max(31)
		.optional()
		.describe("Día del mes correspondiente al corte (1-31)"),
	paymentDueDate: z
		.number()
		.min(1)
		.max(31)
		.optional()
		.describe("Día del mes límite para realizar el pago (1-31)"),
});

export type ProcessedTransaction = {
	id: string;
	amount: number;
	type: "expense" | "income" | "transfer";
	category: string;
	description: string;
	accountName: string;
	date: string;
	accountBalance: number;
};

export type ProcessedBudget = {
	id: string;
	categoria: string;
	limite: number;
};

export type ProcessedAccount = {
	id: string;
	name: string;
	type: string;
	balance: number;
	creditLimit?: number | null;
	cutoffDay?: number | null;
	paymentDueDate?: number | null;
};

export type ProcessFinancialPromptResult =
	| {
			success: true;
			message: string;
			type: "transaction";
			data: ProcessedTransaction;
	  }
	| {
			success: true;
			message: string;
			type: "budget";
			data: ProcessedBudget;
	  }
	| {
			success: true;
			message: string;
			type: "account";
			data: ProcessedAccount;
	  }
	| {
			success: false;
			error: string;
	  };
