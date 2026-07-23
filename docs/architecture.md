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
│   ├── ui/                       # Componentes ShadCN UI (button, input, table, dialog, card, etc.)
│   ├── forms/                    # Formularios con React Hook Form + Zod
│   │   ├── surtidor-form.tsx     # Formulario de surtidor
│   │   ├── venta-form.tsx        # Formulario de venta con pagos
│   │   ├── login-form.tsx        # Formulario de login
│   │   └── usuario-form.tsx      # Formulario de usuarios/roles (admin)
│   │
│   ├── tables/                   # Tablas con TanStack Table
│   │   ├── surtidores-table.tsx  # Tabla de surtidores
│   │   ├── ventas-table.tsx      # Tabla de ventas con pagos
│   │   ├── alertas-table.tsx     # Tabla de alertas
│   │   ├── usuarios-table.tsx    # Tabla de usuarios (admin)
│   │   └── proveedores-table.tsx # Tabla de proveedores
│   │
│   ├── dashboard/                # Componentes del dashboard
│   │   ├── stats-cards.tsx       # Tarjetas de estadísticas
│   │   ├── nivel-indicator.tsx   # Indicador de nivel de combustible
│   │   ├── alerta-led.tsx        # LED de alerta (amarillo/rojo)
│   │   └── ventas-chart.tsx      # Gráfico de ventas
│   │
│   └── layout/                   # Componentes de layout
│       ├── sidebar.tsx           # Barra lateral con menú por rol
│       ├── header.tsx            # Encabezado con info de usuario
│       ├── providers.tsx         # Providers globales
│       └── role-guard.tsx        # Protección de rutas por rol
│
├── lib/                          # Utilidades y configuraciones
│   ├── supabase/                 # Clientes de Supabase
│   │   ├── client.ts            # Cliente browser
│   │   └── server.ts            # Cliente servidor
│   │
│   ├── schemas/                  # Esquemas de validación Zod
│   │   ├── surtidor.ts          # Schema de surtidor
│   │   ├── venta.ts             # Schema de venta con validación de pagos
│   │   ├── auth.ts              # Schema de autenticación
│   │   ├── usuario.ts           # Schema de usuarios y roles
│   │   └── abastecimiento.ts    # Schema de abastecimientos
│   │
│   └── utils.ts                  # Utilidades generales
│
├── hooks/                        # Custom hooks
│   ├── use-surtidores.ts         # Hook para operaciones CRUD
│   ├── use-ventas.ts            # Hook para ventas con pagos
│   ├── use-alertas.ts           # Hook para alertas en tiempo real
│   ├── use-usuarios.ts          # Hook para gestión de usuarios (admin)
│   ├── use-rol.ts               # Hook para verificar rol actual
│   └── use-turno.ts             # Hook para turno activo
│
├── types/                        # Tipos TypeScript
│   ├── surtidor.ts
│   ├── venta.ts
│   ├── alerta.ts
│   ├── usuario.ts
│   └── turno.ts
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
  defaultValues: { nivel: 'lleno', ... }
})
```

### 4. Tablas Headless con TanStack Table

TanStack Table maneja la lógica (ordenamiento, filtros, paginación) mientras ShadCN Table maneja el renderizado visual.

### 5. Autenticación y Protección de Rutas

El sistema usa **Supabase Auth** con un flujo de autenticación del lado del servidor:

```tsx
// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll() } }
  )
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return response
}
```

### 6. Control de Acceso por Rol

Cada página del dashboard verifica el rol del usuario antes de renderizar:

```tsx
// components/layout/role-guard.tsx
'use client'

import { useRol } from '@/hooks/use-rol'

interface RoleGuardProps {
  allowedRoles: string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { rol, isLoading } = useRol()

  if (isLoading) return <div>Cargando...</div>
  if (!rol || !allowedRoles.includes(rol)) {
    return fallback ?? <div>No tienes permiso para acceder a esta página.</div>
  }

  return <>{children}</>
}
```

---

## <a name="flujo-de-datos"></a>Flujo de Datos

### Operación: Registrar una Venta

```
Usuario (Operador)               Frontend                          Supabase
  │                                │                                  │
  │  1. Llena formulario venta     │                                  │
  │     (surtidor, litros, pago)   │                                  │
  │──────────────────────────────> │                                  │
  │                                │                                  │
  │  2. Valida con Zod             │                                  │
  │     - surtidor activo?         │                                  │
  │     - litros ≤ nivel_actual?   │                                  │
  │     - suma pagos = total?      │                                  │
  │                                │                                  │
  │  3. Envía a Server Action      │                                  │
  │     (con session de auth)      │                                  │
  │                                │─────────────────────────────────>│
  │                                │  4. Verifica rol (operador/admin)│
  │                                │                                  │
  │                                │  5. SELECT precio vigente       │
  │                                │     FROM precios_combustible     │
  │                                │                                  │
  │                                │  6. INSERT INTO ventas           │
  │                                │     (con registrado_por = auth.) │
  │                                │                                  │
  │                                │  7. INSERT INTO pagos             │
  │                                │     (uno o varios métodos)       │
  │                                │                                  │
  │                                │  8. TRIGGER: actualizar_nivel    │
  │                                │     UPDATE surtidores            │
  │                                │     SET nivel_litros -= litros   │
  │                                │                                  │
  │                                │  9. TRIGGER: generar_alerta       │
  │                                │     (si nivel bajo/crítico)      │
  │                                │                                  │
  │                                │  10. Realtime: broadcast         │
  │                                │──────────────────────────────────│
  │                                │                                  │
  │  11. Actualiza UI en tiempo    │                                  │
  │      real (nuevo nivel,        │                                  │
  │      alertas si aplica)        │                                  │
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
│  Header: "Surtidor Tunari"    [User] 🔒│
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

### Nivel Indicator

```
Surtidor #1 — Gasolina Premium — Capacidad: 1000L

Nivel actual: bajo (250L / 1000L) — ⚠️ BAJO

[████████░░░░░░░░░░░░░░] 25%

LED: 🟡 Amarillo — Nivel bajo
```

---

## <a name="rutas-y-navegación"></a>Rutas y Navegación

```
/                                    → Dashboard principal
/login                               → Inicio de sesión
/register                            → Registro de usuario

/mis-datos                           → Perfil del usuario actual

# Módulo: Surtidores (admin)
/surtidores                          → Lista de surtidores
/surtidores/nuevo                    → Registrar surtidor
/surtidores/[id]                     → Detalle del surtidor
/surtidores/[id]/editar              → Editar surtidor

# Módulo: Ventas (operador, supervisor, admin)
/ventas                              → Historial de ventas
/ventas/nueva                        → Registrar venta con pago
/ventas/[id]                         → Detalle de venta

# Módulo: Alertas (todos)
/alertas                             → Dashboard de alertas en tiempo real

# Módulo: Reportes (supervisor, admin, auditor)
/reportes                            → Reportes generales
/reportes/diario                     → Ventas diarias
/reportes/inventario                 → Inventario por combustible
/reportes/ingresos                   → Ingresos por combustible

# Módulo: Gestión (admin)
/usuarios                            → Lista de usuarios
/usuarios/nuevo                      → Crear usuario
/usuarios/[id]                       → Editar usuario y roles
/proveedores                         → Lista de proveedores
/proveedores/nuevo                   → Registrar proveedor
/abastecimientos                     → Historial de abastecimientos
/abastecimientos/nuevo               → Registrar abastecimiento
/precios                             → Historial de precios
/precios/nuevo                       → Actualizar precio

# Módulo: Turnos (operador, supervisor)
/turnos                              → Mis turnos
/turnos/activo                       → Turno actual
/turnos/[id]                         → Detalle de turno
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

<div align="center">
  <a href="database.md">← Base de Datos</a> •
  <a href="../README.md">Volver al README</a>
</div>
