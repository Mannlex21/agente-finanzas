# 💰 Agente de Finanzas Personales

> **Agente de Finanzas Personales** es una aplicación web moderna desarrollada con **Next.js**, **TypeScript** y **Tailwind CSS**.
>
> La aplicación permite administrar cuentas bancarias y tarjetas, controlar presupuestos, consultar movimientos financieros y utilizar un **Agente de IA** capaz de interpretar transacciones escritas en lenguaje natural.

---

## 🚀 Características Principales

### 📊 Resumen Financiero

Dashboard principal con una visión general del estado financiero.

* Saldo líquido total.
* Límite de crédito acumulado.
* Número de cuentas registradas.
* Desglose de cuentas.
* Métricas financieras actualizadas dinámicamente.
* Visualización rápida del estado general de las finanzas.

---

### 💳 Gestión de Cuentas y Tarjetas

Administración centralizada de diferentes tipos de cuentas financieras.

#### Tarjetas de crédito

* Nombre de la tarjeta.
* Institución bancaria.
* Límite de crédito.
* Día de corte.
* Día límite de pago.
* Estado de la tarjeta.

#### Tarjetas de débito

* Nombre de la cuenta.
* Institución bancaria.
* Saldo disponible.
* Estado de la cuenta.

#### Cuentas de ahorro

* Nombre de la cuenta.
* Institución financiera.
* Saldo disponible.

#### Efectivo

* Registro de dinero disponible en efectivo.
* Control del saldo actual.

---

### 🤖 Agente de Finanzas con IA

Uno de los módulos principales de la aplicación.

El agente permite registrar transacciones utilizando **lenguaje natural**, evitando la necesidad de llenar manualmente múltiples campos.

Por ejemplo:

```text
Gasté $350 en gasolina en la gasolinera el día de hoy.
```

El agente puede interpretar automáticamente información como:

* 💰 Monto.
* 🏪 Comercio.
* 📂 Categoría.
* ↕️ Tipo de movimiento.
* 📅 Fecha.
* 📝 Descripción.

La respuesta se procesa mediante **streaming**, proporcionando una experiencia interactiva mientras el modelo genera la respuesta.

---

### 📋 Historial de Transacciones

Módulo dedicado a consultar y administrar los movimientos financieros.

* Tabla interactiva.
* Buscador instantáneo.
* Filtros por tipo de movimiento.
* Identificación de ingresos y gastos.
* Visualización del monto.
* Categoría de la transacción.
* Comercio.
* Fecha.
* Descripción.

#### Filtros disponibles

```text
Todos
Gastos
Ingresos
```

---

### 📈 Control de Presupuestos

Sistema para establecer y monitorear límites de gasto mensuales.

* Presupuesto por categoría.
* Monto utilizado.
* Monto disponible.
* Porcentaje de consumo.
* Barras de progreso dinámicas.
* Alertas cuando se supera el límite establecido.

Ejemplo:

```text
Alimentos

Presupuesto:  $5,000
Gastado:      $3,750
Disponible:   $1,250

███████████████░░░░░ 75%
```

---

### ⚙️ Configuración

Panel centralizado para administrar las preferencias de la aplicación.

Incluye:

* Preferencias del sistema.
* Configuración de interfaz.
* Alternancia de modos.
* Gestión de datos.
* Exportación de información a CSV.
* Restablecimiento de datos.
* Opciones relacionadas con seguridad.

---

## 🛠️ Estructura del Proyecto

```text
src/
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   │   # Esqueleto principal del dashboard
│   │   │   # Sidebar + Navbar
│   │   │
│   │   ├── page.tsx
│   │   │   # Resumen financiero y métricas
│   │   │
│   │   ├── accounts/
│   │   │   └── page.tsx
│   │   │       # Gestión de cuentas y tarjetas
│   │   │
│   │   ├── ai-agent/
│   │   │   └── page.tsx
│   │   │       # Agente de Finanzas con IA
│   │   │
│   │   ├── transactions/
│   │   │   └── page.tsx
│   │   │       # Historial de transacciones
│   │   │
│   │   ├── budgets/
│   │   │   └── page.tsx
│   │   │       # Control de presupuestos
│   │   │
│   │   └── settings/
│   │       └── page.tsx
│   │           # Configuración general
│   │
│   ├── components/
│   │   ├── AccountsList.tsx
│   │   │   # Listado de cuentas
│   │   │
│   │   └── AccountModal.tsx
│   │       # Modal para crear y editar cuentas
│   │
│   └── context/
│       └── AccountContext.tsx
│           # Estado global relacionado con cuentas
│
├── public/
│   └── ...
│       # Recursos estáticos
│
├── package.json
│   # Dependencias y scripts
│
└── README.md
    # Documentación del proyecto
```

---

## 📦 Tecnologías Utilizadas

### Frontend

* **[Next.js](https://nextjs.org/)** — Framework principal utilizando App Router.
* **[React](https://react.dev/)** — Biblioteca para construcción de interfaces.
* **[TypeScript](https://www.typescriptlang.org/)** — Tipado estático.
* **[Tailwind CSS](https://tailwindcss.com/)** — Sistema de estilos utilitario.
* **[Lucide React](https://lucide.dev/)** — Biblioteca de iconos.

### IA

* **AI SDK** — Integración y streaming de modelos de lenguaje.
* **LLM Provider** — Proveedor de inteligencia artificial utilizado para interpretar las transacciones.
* **Natural Language Processing** — Procesamiento de instrucciones financieras escritas en lenguaje natural.

### Arquitectura

* **Next.js App Router**
* **React Server Components**
* **Client Components**
* **React Context**
* **API Routes**
* **Streaming de respuestas de IA**

---

## ⚙️ Instalación y Configuración

### Prerrequisitos

Antes de comenzar necesitas tener instalado:

* **Node.js 18.x o superior**
* **npm**, **yarn** o **pnpm**
* Una API Key del proveedor de IA utilizado por el proyecto.

---

### 1. Clonar el repositorio

```bash
git clone <url-de-tu-repositorio>
cd nombre-de-tu-proyecto
```

---

### 2. Instalar las dependencias

Con npm:

```bash
npm install
```

O utilizando Yarn:

```bash
yarn install
```

O utilizando pnpm:

```bash
pnpm install
```

---

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto.

Si utilizas OpenAI:

```env
OPENAI_API_KEY=tu_clave_de_api_aqui
```

Si utilizas otro proveedor de IA, agrega la variable correspondiente según la configuración del proyecto.

> ⚠️ **Importante:** Nunca subas archivos `.env.local` ni claves de API al repositorio. Asegúrate de incluir `.env.local` en `.gitignore`.

---

### 4. Ejecutar el servidor de desarrollo

Con npm:

```bash
npm run dev
```

Con Yarn:

```bash
yarn dev
```

Con pnpm:

```bash
pnpm dev
```

---

### 5. Acceder a la aplicación

Una vez iniciado el servidor, abre:

```text
http://localhost:3000/dashboard
```

---

## 🤖 Flujo del Agente de IA

El procesamiento de una transacción mediante lenguaje natural sigue el siguiente flujo:

```text
┌──────────────────────┐
│       Usuario        │
└──────────┬───────────┘
           │
           │ Lenguaje natural
           ▼
┌──────────────────────┐
│     Agente de IA     │
└──────────┬───────────┘
           │
           │ Prompt
           ▼
┌──────────────────────┐
│      AI SDK          │
└──────────┬───────────┘
           │
           │ Streaming
           ▼
┌──────────────────────┐
│       LLM            │
└──────────┬───────────┘
           │
           │ Interpretación
           ▼
┌────────────────────────────┐
│ Datos de la transacción    │
│                            │
│ • Comercio                 │
│ • Monto                    │
│ • Categoría                │
│ • Tipo                     │
│ • Fecha                    │
│ • Descripción              │
└─────────────┬──────────────┘
              │
              ▼
┌──────────────────────┐
│ Historial financiero │
└──────────────────────┘
```

---

## 🧠 Ejemplos de Uso

### Registrar un gasto

```text
Compré comida por $280 en Walmart.
```

El agente puede identificar:

```text
Tipo:       Gasto
Monto:      $280
Comercio:   Walmart
Categoría:  Alimentos
```

### Registrar un ingreso

```text
Recibí $15,000 de mi salario.
```

El agente puede identificar:

```text
Tipo:       Ingreso
Monto:      $15,000
Categoría:  Salario
```

---

## 📊 Módulos de la Aplicación

| Módulo       | Descripción                          |
| ------------ | ------------------------------------ |
| Dashboard    | Resumen general de las finanzas      |
| Accounts     | Administración de cuentas y tarjetas |
| AI Agent     | Registro inteligente mediante IA     |
| Transactions | Historial de movimientos             |
| Budgets      | Control de presupuestos              |
| Settings     | Configuración del sistema            |

---

## 🎯 Roadmap

### Completado

* [x] Arquitectura base con Next.js App Router.
* [x] Implementación de TypeScript.
* [x] Integración de Tailwind CSS.
* [x] Dashboard estilo Supabase.
* [x] Sidebar lateral.
* [x] Navbar superior.
* [x] Indicador de entorno `PRODUCTION`.
* [x] Dashboard de resumen financiero.
* [x] Gestión de cuentas.
* [x] Gestión de tarjetas de crédito.
* [x] Gestión de tarjetas de débito.
* [x] Gestión de cuentas de ahorro.
* [x] Gestión de efectivo.
* [x] Historial de transacciones.
* [x] Filtros de transacciones.
* [x] Buscador de movimientos.
* [x] Control de presupuestos.
* [x] Barras de progreso.
* [x] Panel de configuración.
* [x] Integración del Agente de IA.
* [x] Procesamiento de lenguaje natural.
* [x] Streaming de respuestas de IA.

### Pendiente

* [ ] Persistencia de cuentas en base de datos.
* [ ] Persistencia de transacciones.
* [ ] Persistencia de presupuestos.
* [ ] Autenticación de usuarios.
* [ ] Historial de conversaciones con el Agente de IA.
* [ ] Extracción estructurada de transacciones mediante IA.
* [ ] Asociación automática de transacciones con cuentas.
* [ ] Cálculo automático de presupuestos a partir de movimientos.
* [ ] Exportación completa de información financiera a CSV.
* [ ] Dashboard con gráficos financieros.
* [ ] Reportes mensuales.
* [ ] Análisis inteligente de hábitos de gasto.
* [ ] Recomendaciones financieras personalizadas.

---

## 🔒 Seguridad

La aplicación debe seguir buenas prácticas para proteger la información financiera y las credenciales de los servicios utilizados.

* No almacenar API Keys en el código fuente.
* Utilizar variables de entorno.
* No publicar archivos `.env.local`.
* Validar los datos recibidos desde el cliente.
* Validar y sanitizar las entradas procesadas por el Agente de IA.
* Implementar autenticación antes de habilitar información financiera personal.
* Aplicar controles de autorización sobre las operaciones de cada usuario.

> **Nota:** Esta aplicación es una herramienta de gestión y organización financiera. No sustituye asesoría financiera profesional.

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**.

Consulta el archivo `LICENSE` para más información.
