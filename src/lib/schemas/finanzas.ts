import { z } from "zod";

// Categorías predefinidas para clasificación de gastos
export const CATEGORIAS_FINANZAS = [
	"Alimentación y Supermercado",
	"Transporte y Gasolina",
	"Vivienda y Servicios",
	"Entretenimiento y Ocio",
	"Salud y Bienestar",
	"Educación",
	"Suscripciones y Tecnología",
	"Otros",
] as const;

// 1. Esquema para parsear y registrar una transacción desde texto plano
export const transaccionSchema = z.object({
	comercio: z
		.string()
		.describe(
			"Nombre del establecimiento, persona o lugar donde se realizó el gasto o ingreso.",
		),
	monto: z
		.number()
		.positive()
		.describe("Monto numérico exacto de la transacción."),
	categoria: z
		.enum(CATEGORIAS_FINANZAS)
		.describe("Categoría en la que encaja la transacción."),
	tipo: z
		.enum(["gasto", "ingreso"])
		.describe(
			"Identifica si es una salida (gasto) o entrada (ingreso) de dinero.",
		),
	fecha: z
		.string()
		.describe("Fecha estimada de la transacción en formato YYYY-MM-DD."),
	esGastoRecurrente: z
		.boolean()
		.describe(
			"Indica si parece ser una suscripción, renta o pago mensual fijo.",
		),
	alertaPresupuesto: z
		.string()
		.optional()
		.describe(
			"Advertencia breve si el gasto parece elevado o fuera de lo común.",
		),
});

// Exportamos el tipo derivado de TypeScript
export type Transaccion = z.infer<typeof transaccionSchema>;
