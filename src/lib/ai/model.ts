import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";

export type AIProvider = "google" | "groq";

export function getAIModel(providerOverride?: AIProvider) {
	const provider =
		providerOverride || (process.env.AI_PROVIDER as AIProvider) || "google";

	switch (provider) {
		case "groq":
			return groq("llama-3.3-70b-versatile");
		case "google":
		default:
			return google("gemini-3.6-flash");
	}
}
