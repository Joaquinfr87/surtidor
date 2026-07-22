# 🛠️ Guía de Tecnologías

> Documentación detallada de las tecnologías utilizadas en el proyecto **"El Surtidor Cochabambino"**.

---

## 📋 Índice

1. [Next.js](#next-js)
2. [Supabase](#supabase)
3. [ShadCN UI](#shadcn-ui)
4. [Zod](#zod)
5. [React Hook Form](#react-hook-form)
6. [TanStack Table](#tanstack-table)
7. [Tailwind CSS](#tailwind-css)
8. [TypeScript](#typescript)

---

## <a name="next-js"></a>⚡ Next.js

**Versión:** 16.2.10

### ¿Qué es?

Next.js es un framework de React que proporciona renderizado del lado del servidor (SSR), generación de sitios estáticos (SSG) y el moderno **App Router** con React Server Components (RSC).

### ¿Por qué lo usamos?

- **App Router:** Sistema de enrutamiento basado en el sistema de archivos con soporte para layouts anidados, loading states y error boundaries.
- **React Server Components:** Renderizado en servidor para mejorar el rendimiento y reducir el JavaScript enviado al cliente.
- **Server Actions:** Ejecución de lógica del lado del servidor directamente desde componentes, ideal para interactuar con Supabase.
- **Optimización:** Carga de imágenes optimizada (`next/image`), fuentes (`next/font`) y metadata automatizada.

### Uso en el proyecto

```typescript
// app/surtidores/page.tsx — Server Component
import { createClient } from '@/lib/supabase/server'
import { SurtidoresTable } from '@/components/surtidores-table'

export default async function SurtidoresPage() {
  const supabase = await createClient()
  const { data: surtidores } = await supabase.from('surtidores').select('*')
  return <SurtidoresTable data={surtidores ?? []} />
}
```

### Recursos

- [Documentación oficial](https://nextjs.org/docs)
- [Tutorial interactivo](https://nextjs.org/learn)
- [GitHub](https://github.com/vercel/next.js)

---

## <a name="supabase"></a>⚡ Supabase

### ¿Qué es?

Supabase es una alternativa **open-source** a Firebase que proporciona una base de datos PostgreSQL, autenticación, almacenamiento de archivos y capacidades en tiempo real.

### ¿Por qué lo usamos?

- **PostgreSQL:** Base de datos relacional madura con soporte para consultas complejas, vistas, funciones y triggers.
- **Row Level Security (RLS):** Políticas de seguridad a nivel de fila para proteger los datos.
- **Realtime:** Suscripciones en tiempo real para actualizar el dashboard de alertas automáticamente.
- **Autenticación:** Sistema completo de auth con soporte para email, OAuth (Google, GitHub) y magic links.
- **API automática:** Endpoints REST y GraphQL generados automáticamente desde el esquema de tablas.

### Uso en el proyecto

```typescript
// lib/supabase/client.ts — Cliente del navegador
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// lib/supabase/server.ts — Cliente del servidor
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )
}
```

### Recursos

- [Documentación oficial](https://supabase.com/docs)
- [Guía de inicio con Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase CLI](https://supabase.com/docs/guides/local-development)

---

## <a name="shadcn-ui"></a>🎨 ShadCN UI

### ¿Qué es?

ShadCN UI es una colección de componentes de interfaz de usuario reutilizables, accesibles y personalizables, construidos sobre **Radix UI** y estilizados con **Tailwind CSS**.

### ¿Por qué lo usamos?

- **Componentes accesibles:** Construidos sobre Radix UI, garantizan accesibilidad (ARIA, navegación por teclado).
- **Personalizables:** No es una librería de dependencias; los componentes se copian al proyecto y se modifican directamente.
- **Tema consistente:** Sistema de tokens de diseño integrado con Tailwind CSS facilita la creación de un tema unificado.
- **Tipado completo:** Componentes con TypeScript para desarrollo seguro.

### Componentes que usaremos

| Componente | Propósito |
|------------|-----------|
| `Button` | Acciones principal y secundarias |
| `Input` | Campos de formulario |
| `Select` | Selección de combustible, surtidor |
| `Table` | Tablas de datos base |
| `Dialog` | Modales para crear/editar registros |
| `Alert` | Notificaciones de alertas de nivel |
| `Card` | Tarjetas de dashboard |
| `Badge` | Indicadores de estado |
| `Toast` | Notificaciones de éxito/error |

### Instalación

```bash
npx shadcn@latest add button input select table dialog alert card badge toast
```

### Uso en el proyecto

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SurtidorForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo Surtidor</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <Input placeholder="Número de surtidor" />
          <Button type="submit">Guardar</Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

### Recursos

- [Documentación oficial](https://ui.shadcn.com/docs)
- [Componentes disponibles](https://ui.shadcn.com/docs/components)
- [Theming](https://ui.shadcn.com/docs/theming)

---

## <a name="zod"></a>🔒 Zod

**Versión:** 3.x

### ¿Qué es?

Zod es una librería de **declaración y validación de esquemas** con inferencia automática de tipos TypeScript.

### ¿Por qué lo usamos?

- **Validación en tiempo de ejecución:** Verifica datos de formularios, APIs y respuestas de base de datos.
- **Inferencia de tipos:** Genera tipos TypeScript automáticamente desde los esquemas, eliminando duplicación.
- **Composición:** Esquemas anidados, transformaciones y refinamientos.
- **Integración:** Compatible con React Hook Form para validación de formularios.

### Uso en el proyecto

```typescript
// lib/schemas/surtidor.ts
import { z } from 'zod'

export const surtidorSchema = z.object({
  numero: z.number().int().positive('El número debe ser positivo'),
  combustible: z.enum(['gasolina_regular', 'gasolina_premium', 'diesel'], {
    errorMap: () => ({ message: 'Selecciona un tipo de combustible' })
  }),
  capacidad: z.number().positive('La capacidad debe ser mayor a 0'),
  nivel: z.enum(['vacio', 'bajo', 'medio', 'lleno'], {
    errorMap: () => ({ message: 'Selecciona un nivel válido' })
  })
})

export type SurtidorInput = z.infer<typeof surtidorSchema>
```

### Recursos

- [Documentación oficial](https://zod.dev)
- [GitHub](https://github.com/colinhacks/zod)
- [Integración con React Hook Form](https://react-hook-form.com/get-started#schemaValidation)

---

## <a name="react-hook-form"></a>📝 React Hook Form

### ¿Qué es?

React Hook Form es una librería para manejar formularios en React con alto rendimiento, minimizando re-renderizados y facilitando la validación.

### ¿Por qué lo usamos?

- **Rendimiento:** Aísla los re-renderizados a campos específicos, no a todo el formulario.
- **Validación nativa:** Se integra con Zod mediante resolvers para validación declarativa.
- **Simplicidad:** API minimalista con menos código boilerplate que otras soluciones.
- **Manejo de errores:** Soporte nativo para errores de validación y mensajes personalizados.

### Uso en el proyecto

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { surtidorSchema, type SurtidorInput } from '@/lib/schemas/surtidor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export function SurtidorForm() {
  const form = useForm<SurtidorInput>({
    resolver: zodResolver(surtidorSchema),
    defaultValues: {
      numero: undefined,
      combustible: undefined,
      capacidad: undefined,
      nivel: 'lleno',
    },
  })

  async function onSubmit(data: SurtidorInput) {
    // Enviar a Supabase
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Surtidor</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  )
}
```

### Recursos

- [Documentación oficial](https://react-hook-form.com/get-started)
- [API Reference](https://react-hook-form.com/api)
- [Resolvedores de validación](https://github.com/react-hook-form/resolvers)

---

## <a name="tanstack-table"></a>📊 TanStack Table

### ¿Qué es?

TanStack Table (anteriormente React Table) es una librería headless para construir tablas de datos con funcionalidades avanzadas: ordenamiento, filtrado, paginación, selección y expansión.

### ¿Por qué lo usamos?

- **Headless UI:** Control total sobre el renderizado — usamos ShadCN Table para los estilos mientras TanStack maneja la lógica.
- **Ordenamiento:** Click en columnas para ordenar ascendente/descendente.
- **Filtrado:** Búsqueda global y filtros por columna.
- **Paginación:** Navegación entre páginas de resultados.
- **Selección:** Checkboxes para seleccionar filas (útil para acciones masivas).
- **TypeScript:** API completamente tipada.

### Uso en el proyecto

```tsx
'use client'

import { useMemo, useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'

interface Surtidor {
  id: number
  numero: number
  combustible: string
  capacidad: number
  nivel: string
}

const columns: ColumnDef<Surtidor>[] = [
  { accessorKey: 'numero', header: 'N°', enableSorting: true },
  { accessorKey: 'combustible', header: 'Combustible' },
  { accessorKey: 'capacidad', header: 'Capacidad (L)' },
  {
    accessorKey: 'nivel',
    header: 'Nivel',
    cell: ({ row }) => (
      <span className={`badge-${row.original.nivel === 'lleno' ? 'green' : row.original.nivel === 'medio' ? 'yellow' : 'red'}`}>
        {row.original.nivel === 'vacio' ? 'Vacío' :
         row.original.nivel === 'bajo' ? 'Bajo' :
         row.original.nivel === 'medio' ? 'Medio' : 'Lleno'}
      </span>
    ),
  },
]

export function SurtidoresTable({ data }: { data: Surtidor[] }) {
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div>
      <Input
        placeholder="Buscar surtidor..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm mb-4"
      />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

### Recursos

- [Documentación oficial](https://tanstack.com/table/latest/docs/introduction)
- [API Reference](https://tanstack.com/table/latest/docs/api/core/table)
- [Ejemplos](https://tanstack.com/table/latest/docs/framework/react/examples/basic)

---

## <a name="tailwind-css"></a>🎨 Tailwind CSS

**Versión:** 4

### ¿Qué es?

Tailwind CSS es un framework de CSS utilitario que permite construir diseños personalizados directamente en el marcado HTML/JSX.

### ¿Por qué lo usamos?

- **Rapidez:** Desarrollo rápido sin cambiar de archivo (todo en JSX).
- **Consistencia:** Sistema de tokens de diseño integrado.
- **Responsive:** Utilidades prefijadas para diseño adaptable.
- **Personalización:** Configurable mediante `tailwind.config.ts`.

### Recursos

- [Documentación oficial](https://tailwindcss.com/docs)
- [Tailwind v4 cambios](https://tailwindcss.com/blog/tailwindcss-v4)

---

## <a name="typescript"></a>📘 TypeScript

**Versión:** 5

### ¿Qué es?

TypeScript es un superconjunto de JavaScript que añade tipado estático opcional.

### ¿Por qué lo usamos?

- **Seguridad:** Captura errores en tiempo de compilación.
- **DX:** Autocompletado, refactors seguros y documentación en el código.
- **Escalabilidad:** Mantenibilidad en proyectos grandes.

### Recursos

- [Documentación oficial](https://www.typescriptlang.org/docs/)
- [Playground](https://www.typescriptlang.org/play/)

---

<div align="center">
  <a href="../README.md">← Volver al README</a> •
  <a href="database.md">Base de Datos →</a>
</div>
