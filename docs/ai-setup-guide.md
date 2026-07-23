# 🤖 AI Setup Guide — Configuración Inicial para CRUD y Dashboard

> **Propósito:** Guía para que un agente de IA configure correctamente el proyecto antes de comenzar a implementar los módulos CRUD y el dashboard.
>
> **Stack:** Next.js 16 (App Router) + Supabase + ShadCN UI + React Hook Form + Zod + Tailwind v4

---

## 📋 Índice

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Variables de Entorno](#variables-de-entorno)
3. [Clientes de Supabase](#clientes-de-supabase)
4. [Middleware de Autenticación](#middleware-de-autenticación)
5. [Esquemas Zod](#esquemas-zod)
6. [Componentes Base ShadCN](#componentes-base-shadcn)
7. [Dependencias Faltantes](#dependencias-faltantes)
8. [Estructura de un Módulo CRUD](#estructura-de-un-módulo-crud)
9. [Dashboard](#dashboard)
10. [Verificación Final](#verificación-final)

---

## 1. Estructura del Proyecto

```
surtidor/
├── app/
│   ├── layout.tsx                    # Layout raíz (fuentes, SidebarProvider)
│   ├── globals.css                   # Tailwind v4 + shadcn/tailwind.css
│   │
│   ├── (auth)/                       # Grupo de rutas de autenticación
│   │   ├── layout.tsx                # Layout centrado (flex + justify-center)
│   │   ├── login/page.tsx            # Página de login
│   │   ├── login/actions.ts          # Server Action: signIn
│   │   ├── register/page.tsx         # Página de registro
│   │   ├── register/actions.ts       # Server Action: signUp
│   │   ├── logout/actions.ts         # Server Action: signOut
│   │   └── confirm/route.ts          # Ruta de confirmación de email
│   │
│   ├── (dashboard)/                  # Grupo de rutas protegidas
│   │   ├── layout.tsx                # Layout con Sidebar + Header
│   │   ├── page.tsx                  # Dashboard (stats placeholder)
│   │   ├── surtidores/               # ⬅️ Módulo a implementar
│   │   ├── ventas/                   # ⬅️ Módulo a implementar
│   │   ├── alertas/                  # ⬅️ Módulo a implementar
│   │   └── reportes/                 # ⬅️ Módulo a implementar
│   │
│   ├── api/                          # API Routes (opcional, Server Actions > API routes)
│
├── components/
│   ├── ui/                           # Componentes ShadCN (button, input, card, form, etc.)
│   ├── forms/                        # Formularios (login-form, register-form)
│   └── layout/                       # header.tsx, app-sidebar.tsx
│
├── lib/
│   ├── schemas/                      # Esquemas Zod (auth.ts)
│   └── utils.ts                      # cn() helper
│
├── utils/
│   └── supabase/
│       ├── client.ts                 # Cliente browser (createBrowserClient)
│       ├── server.ts                 # Cliente servidor (createServerClient)
│       └── proxy.ts                  # Función updateSession para middleware
│
├── docs/
│   ├── architecture.md               # Arquitectura del sistema
│   ├── database.md                   # Esquema completo de base de datos
│   ├── technologies.md               # Guía de tecnologías
│   ├── ai-setup-guide.md             # 📄 Este archivo
│   └── ai-crud-guide.md              # 📄 Guía de CRUD
│
└── types/                            # ⚠️ Carpeta a crear (para DatabaseTypes)
```

---

## 2. Variables de Entorno

El proyecto usa estas variables. **Verificar que existan en `.env.local`:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon-key>
```

> **Nota:** La key pública se llama `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (NO `NEXT_PUBLIC_SUPABASE_ANON_KEY`). Ambas son equivalentes, pero el proyecto ya usa `PUBLISHABLE_KEY` en `client.ts` y `server.ts`.

---

## 3. Clientes de Supabase

Ya existen y funcionan. NO modificarlos:

### Cliente Browser (`utils/supabase/client.ts`)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```

**Usar en:** Componentes Cliente (`'use client'`) para operaciones en tiempo real o interactividad que requiera el cliente de browser.

### Cliente Servidor (`utils/supabase/server.ts`)
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet, _headers) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignorar en Server Components (middleware refresca sesión)
          }
        },
      },
    }
  )
}
```

**Usar en:** Server Components y Server Actions para fetching y mutaciones de datos.

### Cliente Proxy (`utils/supabase/proxy.ts`)

Usado en el middleware para refrescar sesión. Ya implementado. NO modificar.

---

## 4. Middleware de Autenticación

**IMPORTANTE:** Aunque `utils/supabase/proxy.ts` ya existe con la función `updateSession()`, **verificar que exista `middleware.ts` en la raíz del proyecto**. Si no existe, crearlo:

```typescript
// middleware.ts — raíz del proyecto
import { updateSession } from '@/utils/supabase/proxy'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## 5. Esquemas Zod

Los esquemas ya existen en `lib/schemas/`:
- `lib/schemas/auth.ts` — loginSchema, registerSchema

**Para cada nuevo módulo CRUD**, crear un archivo separado:
- `lib/schemas/surtidor.ts`
- `lib/schemas/venta.ts`
- `lib/schemas/abastecimiento.ts`
- etc.

### Patrón estándar:
```typescript
import { z } from 'zod'

export const surtidorSchema = z.object({
  numero: z.coerce.number().int().positive('Debe ser un número positivo'),
  tipo_combustible_id: z.string().min(1, 'Selecciona un tipo de combustible'),
  capacidad: z.coerce.number().positive('Debe ser mayor a 0'),
  activo: z.boolean().default(true),
})

// Para actualizaciones parciales
export const surtidorUpdateSchema = surtidorSchema.partial()

export type SurtidorInput = z.infer<typeof surtidorSchema>
export type SurtidorUpdateInput = z.infer<typeof surtidorUpdateSchema>
```

> ⚠️ **Nota:** Zod v4 (instalada) usa `z.coerce.number()` en lugar de `z.number().parse()` para manejar inputs de formulario (que siempre son strings).

---

## 6. Componentes Base ShadCN

**Componentes YA instalados y disponibles:**
- `button`, `input`, `label`, `card`, `form`, `avatar`, `separator`, `skeleton`, `tooltip`, `dropdown-menu`, `sidebar`, `sheet`

**Componentes que podrían faltar y deberían instalarse con:**
```bash
npx shadcn@latest add table dialog select badge toast textarea
```

| Componente | Módulo | Propósito |
|---|---|---|
| `table` | Todos | Tablas de datos |
| `dialog` | CRUD | Modales para crear/editar |
| `select` | Surtidores, Ventas | Selección de combustibles, métodos de pago |
| `badge` | Dashboard, Alertas | Indicadores de estado |
| `toast` | CRUD | Notificaciones de éxito/error |
| `textarea` | Varios | Notas y observaciones |

---

## 7. Dependencias Faltantes

### Dependencias a instalar para los módulos CRUD:

```bash
# Tablas headless con ordenamiento, filtros y paginación
pnpm add @tanstack/react-table

# Gráficos para el dashboard (Recharts — más popular, simple y liviano)
pnpm add recharts
```

> 💡 **Nota:** Se eligió **Recharts** sobre Tremor porque es más popular (mayor comunidad/ejemplos), no requiere configuración adicional de Tailwind, y es más liviano. Si se prefiere Tremor, reemplazar `recharts` con `@tremor/react` y seguir su guía de instalación.

**Dependencias ya instaladas (verificar en `package.json`):**

| Paquete | Versión | Propósito |
|---|---|---|
| `next` | ^16.2.10 | Framework |
| `react` / `react-dom` | ^19 | UI |
| `@supabase/ssr` | ^0.12.3 | Supabase SSR |
| `@supabase/supabase-js` | ^2.110.7 | Supabase JS |
| `react-hook-form` | ^7.82.0 | Formularios |
| `zod` | ^4.4.3 | Validación |
| `@hookform/resolvers` | ^5.4.0 | Integración RHF + Zod |
| `@radix-ui/react-slot` | ^1.3.0 | Composición ShadCN |
| `lucide-react` | ^1.25.0 | Iconos |
| `class-variance-authority` | ^0.7.1 | Variantes de componentes |
| `clsx` / `tailwind-merge` | ^2/^3 | Utilidades CSS |
| `tw-animate-css` | ^1.4.0 | Animaciones Tailwind |

---

## 8. Estructura de un Módulo CRUD

Cada módulo (surtidores, ventas, etc.) dentro de `app/(dashboard)/` debe seguir esta estructura:

```
app/(dashboard)/surtidores/
├── page.tsx                         # Server Component → Lista (fetch + tabla)
├── [id]/
│   ├── page.tsx                     # Server Component → Detalle
│   └── editar/
│       └── page.tsx                 # Server Component → Editar
├── nuevo/
│   └── page.tsx                     # Server Component → Crear
└── _components/
    ├── surtidores-table-client.tsx  # Client Component → TanStack Table
    └── surtidor-form.tsx            # Client Component → React Hook Form
```

**Donde poner las Server Actions:**
- Si son **específicas del módulo**: en `app/(dashboard)/surtidores/actions.ts`
- Si son **compartidas entre módulos**: en `lib/actions/surtidores.ts`

---

## 9. Dashboard

El dashboard actual (`app/(dashboard)/page.tsx`) tiene estadísticas placeholder (con valores `—`). 

Para conectarlo con Supabase, convertirlo a Server Component que fetchea datos reales:

```typescript
// app/(dashboard)/page.tsx — Server Component
import { createClient } from '@/utils/supabase/server'
import { DashboardClient } from './_components/dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: surtidoresActivos },
    { count: ventasHoy },
    { count: alertasActivas },
  ] = await Promise.all([
    supabase.from('surtidores').select('*', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('ventas').select('*', { count: 'exact', head: true }).gte('fecha', 'today'),
    supabase.from('alertas').select('*', { count: 'exact', head: true }).eq('activa', true),
  ])

  return (
    <DashboardClient
      stats={{
        surtidores: surtidoresActivos ?? 0,
        ventasHoy: ventasHoy ?? 0,
        alertasActivas: alertasActivas ?? 0,
      }}
    />
  )
}
```

---

## 10. Verificación Final

Antes de empezar a implementar módulos, el agente de IA debe verificar:

- [ ] `middleware.ts` existe en la raíz (si no, crearlo con `updateSession` de `utils/supabase/proxy.ts`)
- [ ] `.env.local` tiene las variables correctas (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
- [ ] `pnpm install` o `pnpm i` ejecutado sin errores
- [ ] `pnpm dev` levanta el proyecto sin errores
- [ ] `types/` carpeta existe para DatabaseTypes de Supabase
- [ ] Componentes ShadCN necesarios están instalados (`table`, `dialog`, `select`, `badge`, `toast`)
- [ ] `@tanstack/react-table` está instalado (para tablas)
- [ ] Se generaron los Database Types: `npx supabase gen types typescript --linked > types/database.ts`
- [ ] El esquema de base de datos de `docs/database.md` está aplicado en Supabase

---

> **Siguiente paso:** Una vez verificada la configuración, seguir [`docs/ai-crud-guide.md`](./ai-crud-guide.md) para implementar cada módulo CRUD.
