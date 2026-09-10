import { streamText, Output } from "ai";
import { NextResponse } from "next/server";
import { getAIModel, AIProvider } from "@/lib/ai/model";
import { transaccionSchema } from "@/lib/schemas/finanzas";

export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const { prompt, provider } = await req.json();

		if (!prompt || typeof prompt !== "string") {
			return NextResponse.json(
				{ error: "El prompt es requerido." },
				{ status: 400 },
			);
		}

		const model = getAIModel(provider as AIProvider);

		const result = streamText({
			model,
			output: Output.object({ schema: transaccionSchema }),
			system: `Eres un asistente de finanzas personales. Tu función es extraer y estructurar 
los datos de transacciones a partir del texto ingresado por el usuario.
Identifica comercio, monto, categoría adecuada, tipo (gasto/ingreso) y fecha.`,
			prompt,
		});

		// Usamos el stream nativo de la v7 para evitar cualquier método deprecado de helpers HTTP
		return new Response(result.textStream, {
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
			},
		});
	} catch (error) {
		console.error("Error al procesar la transacción:", error);
		return NextResponse.json(
			{ error: "Error interno al procesar el gasto." },
			{ status: 500 },
		);
	}
}
