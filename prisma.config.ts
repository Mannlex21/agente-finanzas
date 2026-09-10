import "dotenv/config";
import { defineConfig } from "@prisma/config";
import process from "node:process";

const directUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!directUrl) {
	throw new Error(
		"No se encontró DIRECT_URL ni DATABASE_URL en el archivo .env",
	);
}

export default defineConfig({
	datasource: {
		url: directUrl,
	},
	migrations: {
		seed: "npx tsx prisma/seed.ts",
	},
});
