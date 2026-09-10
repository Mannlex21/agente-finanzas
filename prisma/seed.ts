import { PrismaClient, AccountType, TransactionType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config({ path: ".env.local" }); // O ".env"

// Crear la conexión usando el driver adapter pg
const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	console.log("🌱 Iniciando el proceso de seed...");

	// 1. Limpiar datos existentes
	await prisma.transaction.deleteMany();
	await prisma.financialAccount.deleteMany();
	await prisma.budget.deleteMany();

	console.log("🧹 Base de datos limpiada.");

	// 2. Crear Cuentas Financieras
	const cuentaNomina = await prisma.financialAccount.create({
		data: {
			name: "BBVA Nómina",
			type: AccountType.debit_card,
			balance: 18500.5,
			currency: "MXN",
		},
	});

	const tarjetaOro = await prisma.financialAccount.create({
		data: {
			name: "Tarjeta Visa Oro",
			type: AccountType.credit_card,
			balance: 4200.0,
			creditLimit: 30000.0,
			cutoffDay: 15,
			paymentDueDate: 5,
			currency: "MXN",
		},
	});

	const efectivo = await prisma.financialAccount.create({
		data: {
			name: "Efectivo",
			type: AccountType.cash,
			balance: 1200.0,
			currency: "MXN",
		},
	});

	const ahorro = await prisma.financialAccount.create({
		data: {
			name: "Fondo de Emergencia",
			type: AccountType.savings,
			balance: 50000.0,
			currency: "MXN",
		},
	});

	console.log("💳 Cuentas financieras creadas.");

	// 3. Crear Presupuestos
	await prisma.budget.createMany({
		data: [
			{ categoria: "Supermercado", limite: 6000.0 },
			{ categoria: "Restaurantes", limite: 2500.0 },
			{ categoria: "Entretenimiento", limite: 1500.0 },
			{ categoria: "Servicios", limite: 3000.0 },
			{ categoria: "Transporte", limite: 2000.0 },
		],
	});

	console.log("🎯 Presupuestos iniciales creados.");

	// 4. Crear Transacciones de prueba
	await prisma.transaction.createMany({
		data: [
			{
				comercio: "Walmart",
				monto: 1450.8,
				categoria: "Supermercado",
				tipo: TransactionType.gasto,
				accountId: tarjetaOro.id,
			},
			{
				comercio: "OXXO",
				monto: 85.0,
				categoria: "Supermercado",
				tipo: TransactionType.gasto,
				accountId: efectivo.id,
			},
			{
				comercio: "CFE",
				monto: 620.0,
				categoria: "Servicios",
				tipo: TransactionType.gasto,
				accountId: cuentaNomina.id,
			},
			{
				comercio: "Pago de Nómina",
				monto: 15000.0,
				categoria: "Ingreso",
				tipo: TransactionType.ingreso,
				accountId: cuentaNomina.id,
			},
			{
				comercio: "Restaurant El Asador",
				monto: 890.0,
				categoria: "Restaurantes",
				tipo: TransactionType.gasto,
				alertaPresupuesto: "Cerca del límite mensual en Restaurantes",
				accountId: tarjetaOro.id,
			},
		],
	});

	console.log("📊 Transacciones iniciales creadas.");
	console.log("✅ Seed completado con éxito.");
}

main()
	.catch((e) => {
		console.error("❌ Error ejecutando el seed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
