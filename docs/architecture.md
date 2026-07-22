# 🏗️ Arquitectura del Sistema

> Documentación de la arquitectura del **Sistema de Control para Surtidor de Gasolina**.

---

## 📋 Índice

1. [Stack Tecnológico](#stack-tecnológico)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Patrones de Diseño](#patrones-de-diseño)
4. [Flujo de Datos](#flujo-de-datos)
5. [Componentes UI](#componentes-ui)
6. [Rutas y Navegación](#rutas-y-navegación)
7. [Manejo de Estado](#manejo-de-estado)
8. [Aplicación de Sistemas Digitales](#aplicación-de-sistemas-digitales)

---

## <a name="stack-tecnológico"></a>Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                     │
├────────────┬──────────┬──────────┬───────────┬──────────────┤
│ App Router │ ShadCN   │ R. Hook  │ TanStack  │ Tailwind CSS │
│ (RSC/SFC)   │ UI       │ Form     │ Table     │              │
├────────────┴──────────┴──────────┴───────────┴──────────────┤
│                     VALIDACIÓN (Zod)                         │
├─────────────────────────────────────────────────────────────┤
│                   BACKEND (Supabase)                         │
├────────────┬──────────┬──────────┬──────────────────────────┤
│ PostgreSQL │ Auth     │ Realtime │ Storage                  │
│ (RLS/Trig.)│ (JWT)    │ (WS)     │                          │
└────────────┴──────────┴──────────┴──────────────────────────┘
```

---

## <a name="estructura-del-proyecto"></a>Estructura del Proyecto

```
surtidor/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Layout raíz (fuentes, metadata)
│   ├── page.tsx                  # Dashboard principal
│   ├── globals.css               # Estilos globales Tailwind
│   │
│   ├── (auth)/                   # Grupo de rutas de autenticación
│   │   ├── login/page.tsx        # Página de inicio de sesión
│   │   └── register/page.tsx     # Página de registro
│   │
│   ├── (dashboard)/              # Grupo de rutas protegidas
│   │   ├── layout.tsx            # Layout del dashboard (sidebar + header)
│   │   │
│   │   ├── surtidores/           # Módulo de surtidores
│   │   │   ├── page.tsx          # Lista de surtidores
│   │   │   ├── nuevo/page.tsx    # Crear surtidor
│   │   │   └── [id]/             # Detalle y edición
│   │   │       ├── page.tsx      # Ver surtidor
│   │   │       └── editar/page.tsx # Editar surtidor
│   │   │
│   │   ├── ventas/               # Módulo de ventas
│   │   │   ├── page.tsx          # Historial de ventas
│   │   │   └── nueva/page.tsx    # Registrar venta
│   │   │
│   │   ├── alertas/              # Módulo de alertas
│   │   │   └── page.tsx          # Dashboard de alertas
│   │   │
│   │   └── reportes/             # Módulo de reportes
│   │       ├── page.tsx          # Reportes generales
│   │       ├── diario/page.tsx   # Ventas diarias
│   │       └── inventario/page.tsx # Inventario
│   │
│   └── api/                      # API Routes (serverless functions)
│       └── surtidores/           # Endpoints de surtidores
│           └── route.ts
│
├── components/                   # Componentes React
│   ├── ui/                       # Componentes ShadCN UI
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   └── toast.tsx
│   │
│   ├── forms/                    # Formularios con React Hook Form
│   │   ├── surtidor-form.tsx     # Formulario de surtidor
│   │   ├── venta-form.tsx        # Formulario de venta
│   │   └── login-form.tsx        # Formulario de login
│   │
│   ├── tables/                   # Tablas con TanStack Table
│   │   ├── surtidores-table.tsx  # Tabla de surtidores
│   │   ├── ventas-table.tsx      # Tabla de ventas
│   │   └── alertas-table.tsx     # Tabla de alertas
│   │
│   ├── dashboard/                # Componentes del dashboard
│   │   ├── stats-cards.tsx       # Tarjetas de estadísticas
│   │   ├── nivel-indicator.tsx   # Indicador de nivel binario
│   │   └── alerta-led.tsx        # LED de alerta (amarillo/rojo)
│   │
│   └── layout/                   # Componentes de layout
│       ├── sidebar.tsx           # Barra lateral de navegación
│       ├── header.tsx            # Encabezado
│       └── providers.tsx         # Providers globales
│
├── lib/                          # Utilidades y configuraciones
│   ├── supabase/                 # Clientes de Supabase
│   │   ├── client.ts            # Cliente browser
│   │   └── server.ts            # Cliente servidor
│   │
│   ├── schemas/                  # Esquemas de validación Zod
│   │   ├── surtidor.ts          # Schema de surtidor
│   │   ├── venta.ts             # Schema de venta
│   │   └── auth.ts              # Schema de autenticación
│   │
│   ├── utils.ts                  # Utilidades generales
│   └── binary.ts                 # Funciones de aritmética binaria
│
├── hooks/                        # Custom hooks
│   ├── use-surtidores.ts         # Hook para operaciones CRUD
│   ├── use-ventas.ts            # Hook para ventas
│   └── use-alertas.ts           # Hook para alertas en tiempo real
│
├── types/                        # Tipos TypeScript
│   ├── surtidor.ts
│   ├── venta.ts
│   └── alerta.ts
│
├── docs/                         # Documentación
│   ├── technologies.md           # Guía de tecnologías
│   ├── database.md               # Esquema de base de datos
│   └── architecture.md           # Esta documentación
│
├── public/                       # Archivos estáticos
├── .env.example                  # Variables de entorno de ejemplo
├── .env.local                    # Variables de entorno locales
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── eslint.config.mjs
```

---

## <a name="patrones-de-diseño"></a>Patrones de Diseño

### 1. Server Components + Client Components

Next.js App Router permite separar componentes en:

- **Server Components** (por defecto): Renderizan en el servidor, ideales para fetching de datos y contenido estático.
- **Client Components** (`'use client'`): Renderizan en el navegador, necesarios para interactividad, formularios y hooks.

```tsx
// app/surtidores/page.tsx — Server Component
import { createClient } from '@/lib/supabase/server'
import { SurtidoresClient } from './surtidores-client'

export default async function SurtidoresPage() {
  const supabase = await createClient()
  const { data: surtidores } = await supabase.from('surtidores').select('*')
  return <SurtidoresClient initialData={surtidores ?? []} />
}
```

```tsx
// app/surtidores/surtidores-client.tsx — Client Component
'use client'
import { SurtidoresTable } from '@/components/tables/surtidores-table'

export function SurtidoresClient({ initialData }) {
  return <SurtidoresTable data={initialData} />
}
```

### 2. Composición de Componentes (ShadCN UI)

ShadCN fomenta la composición sobre la configuración. Los componentes se importan y anidan libremente:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Nuevo Surtidor</CardTitle>
    <CardDescription>Completa los campos para registrar un nuevo surtidor</CardDescription>
  </CardHeader>
  <CardContent>
    <Form {...form}>
      <form onSubmit={...}>
        <FormField ... />
        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  </CardContent>
</Card>
```

### 3. Validación con Zod + React Hook Form

Los esquemas de Zod se integran con React Hook Form mediante resolvers:

```tsx
const form = useForm<SurtidorInput>({
  resolver: zodResolver(surtidorSchema),
  defaultValues: { nivel: '11', ... }
})
```

### 4. Tablas Headless con TanStack Table

TanStack Table maneja la lógica (ordenamiento, filtros, paginación) mientras ShadCN Table maneja el renderizado visual.

---

## <a name="flujo-de-datos"></a>Flujo de Datos

### Operación: Registrar una Venta

```
Usuario                          Frontend                          Supabase
  │                                │                                  │
  │  1. Llena formulario venta     │                                  │
  │──────────────────────────────> │                                  │
  │                                │                                  │
  │  2. Valida con Zod             │                                  │
  │                                │                                  │
  │  3. Envía a Server Action      │                                  │
  │                                │─────────────────────────────────>│
  │                                │  4. INSERT INTO ventas           │
  │                                │                                  │
  │                                │  5. TRIGGER: actualizar_nivel    │
  │                                │     UPDATE surtidores SET nivel  │
  │                                │                                  │
  │                                │  6. TRIGGER: generar_alerta      │
  │                                │     INSERT INTO alertas (si       │
  │                                │     nivel bajo/crítico)           │
  │                                │                                  │
  │                                │  7. Realtime: broadcast cambio   │
  │                                │──────────────────────────────────│
  │                                │                                  │
  │  8. Actualiza UI en tiempo real│                                  │
  │<───────────────────────────────│                                  │
```

### Operación: Monitoreo de Alertas en Tiempo Real

```
Supabase Realtime                    Frontend
     │                                  │
     │  1. Suscripción canal alertas    │
     │<─────────────────────────────────│
     │                                  │
     │  2. INSERT en alertas            │
     │     (por trigger de nivel)       │
     │                                  │
     │  3. Broadcast a suscriptores     │
     │─────────────────────────────────>│
     │                                  │
     │  4. Actualiza dashboard          │
     │     Muestra LED amarillo/rojo    │
     │     Notifica al usuario          │
     │                                  │
```

---

## <a name="componentes-ui"></a>Componentes UI

### Dashboard Principal

```
┌─────────────────────────────────────────────────┐
│  Header: "El Surtidor Cochabambino"    [User] 🔒│
├──────────┬──────────────────────────────────────┤
│          │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ Sidebar  │  │⛽ 12  │ │💰 1.2k│ │🚨 3  │ │📊 5  │ │
│          │  │Surts. │ │Ventas │ │Alert.│ │Repor.│ │
│ 📊Dashboard│  └──────┘ └──────┘ └──────┘ └──────┘ │
│ ⛽Surtidores│                                         │
│ 💰Ventas   │  ┌─────────────────────────────────┐   │
│ 🚨Alertas  │  │    Gráfico de Ventas (semana)   │   │
│ 📊Reportes │  └─────────────────────────────────┘   │
│          │                                         │
└──────────┴─────────────────────────────────────────┘
```

### Nivel Indicator (Binario)

```
Surtidor #1 — Gasolina Premium — Capacidad: 1000L

Nivel actual: 01 (25%) — ⚠️ BAJO

[████████░░░░░░░░░░░░░░] 25%

LED: 🟡 Amarillo

Representación binaria: N1=0, N0=1
Alerta: ¬N1 · N0 = 1 · 1 = 1 (activa)
```

---

## <a name="rutas-y-navegación"></a>Rutas y Navegación

```
/                           → Dashboard principal
/login                      → Inicio de sesión
/register                   → Registro de usuario

/surtidores                 → Lista de surtidores (Tabla)
/surtidores/nuevo           → Registrar surtidor (Formulario)
/surtidores/[id]            → Detalle del surtidor
/surtidores/[id]/editar     → Editar surtidor (Formulario)

/ventas                     → Historial de ventas (Tabla)
/ventas/nueva               → Registrar venta (Formulario)

/alertas                    → Dashboard de alertas en tiempo real

/reportes                   → Reportes generales
/reportes/diario            → Ventas diarias
/reportes/inventario        → Inventario por combustible
```

---

## <a name="manejo-de-estado"></a>Manejo de Estado

| Tipo | Solución | Uso |
|------|----------|-----|
| Estado local | `useState` / `useReducer` | Formularios, modales, toggles |
| Estado de formularios | React Hook Form | Todos los formularios del sistema |
| Estado del servidor | Server Components | Datos iniciales de Supabase |
| Cache de datos | TanStack Query (futuro) | Refetch y caché de consultas |
| Tiempo real | Supabase Realtime | Alertas y actualizaciones en vivo |

---

## <a name="aplicación-de-sistemas-digitales"></a>Aplicación de Sistemas Digitales

### Resumen de Conceptos

| Concepto SD | Aplicación en el Sistema |
|-------------|--------------------------|
| **Códigos binarios** | Niveles de combustible representados como `00`, `01`, `10`, `11` |
| **Álgebra de Boole** | Expresiones booleanas para determinar alertas |
| **Mapas de Karnaugh** | Minimización de expresiones lógicas de alertas |
| **Compuertas lógicas** | Implementación de AND, OR, NOT en lógica de alertas |
| **Codificadores** | Conversión de nivel numérico a binario |
| **Decodificadores** | Decodificación de tipo de combustible desde binario |
| **Aritmética binaria** | Cálculo de totales de venta |

### Circuito Lógico de Alertas

```
                    ┌─────┐
N1 ────────────────│ INV │
                    └──┬──┘
                       │    ┌─────┐
                       └────│     │
                            │ AND │── Alerta Amarilla (¬N1 · N0)
N0 ────────────────────────│     │
                            └─────┘

                    ┌─────┐
N1 ────────────────│ INV │
                    └──┬──┘
                       │    ┌─────┐
                       └────│     │
                            │ AND │── Alerta Roja (¬N1 · ¬N0)
                    ┌─────┐│     │
N0 ────────────────│ INV │└─────┘
                    └─────┘
```

### Mapa de Karnaugh para Alertas

```
         N0
       0     1
    ┌─────┬─────┐
  0 │  R  │  A  │   R = Alerta Roja (crítico)
    │     │     │   A = Alerta Amarilla (bajo)
N1 ├─────┼─────┤   - = Sin alerta
  1 │  -  │  -  │
    └─────┴─────┘

Expresiones minimizadas:
  Alerta_Roja     = ¬N1 · ¬N0  (celda 00)
  Alerta_Amarilla = ¬N1 · N0   (celda 01)
```

### Decodificador de Combustible (3:2)

```
Entrada (2 bits) → Salida (tipo de combustible)
   00 → Gasolina Regular
   01 → Gasolina Premium
   10 → Diésel
```

---

<div align="center">
  <a href="database.md">← Base de Datos</a> •
  <a href="../README.md">Volver al README</a>
</div>
