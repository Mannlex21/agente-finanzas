export type AccountType = "debit_card" | "credit_card" | "cash" | "savings";

export interface FinancialAccount {
	id: string;
	name: string; // Ej: "BBVA Nómina", "Tarjeta Visa Oro"
	type: AccountType;
	balance: number; // Saldo actual
	creditLimit?: number; // Solo tarjetas de crédito
	cutoffDay?: number; // Día de corte
	paymentDueDate?: number; // Día de límite de pago
	currency: string; // Ej: "MXN"
}
