# 🤖 AI CRUD Guide — Guía de Creación de Módulos CRUD

> **Propósito:** Guía paso a paso para que un agente de IA implemente cada módulo CRUD del sistema "Surtidor Tunari" usando Next.js + Supabase con las mejores prácticas.
>
> **Stack:** Next.js 16 (App Router) + Supabase SSR + ShadCN UI + React Hook Form + Zod v4 + TanStack Table

---

## 📋 Índice

1. [Patrón General](#patrón-general)
2. [Paso 1: Crear Esquema Zod y Tipos](#paso-1-crear-esquema-zod-y-tipos)
3. [Paso 2: Crear Server Actions](#paso-2-crear-server-actions)
4. [Paso 3: Crear Server Component (Lista)](#paso-3-crear-server-component-lista)
5. [Paso 4: Crear Client Component (Tabla)](#paso-4-crear-client-component-tabla)
6. [Paso 5: Crear Formulario (Crear/Editar)](#paso-5-crear-formulario-creareditar)
7. [Paso 6: Crear Páginas de Detalle](#paso-6-crear-páginas-de-detalle)
8. [Paso 7: Conectar al Sidebar](#paso-7-conectar-al-sidebar)
9. [Paso 8: Políticas RLS](#paso-8-políticas-rls)
10. [Checklist de Verificación](#checklist-de-verificación)
11. [Ejemplo Completo: Módulo Surtidores](#ejemplo-completo-módulo-surtidores)
12. [Ejemplo Completo: Módulo Ventas (con relaciones)](#ejemplo-completo-módulo-ventas-con-relaciones)

---

## Patrón General

Cada módulo CRUD sigue exactamente el mismo patrón. La IA debe generar archivos en este orden:

```
1. lib/schemas/<modulo>.ts          → Esquema Zod + tipos inferidos
2. app/(dashboard)/<modulo>/actions.ts → Server Actions CRUD
3. app/(dashboard)/<modulo>/page.tsx → Server Component (lista)
4. app/(dashboard)/<modulo>/_components/<modulo>-table.tsx → Client Component (tabla)
5. app/(dashboard)/<modulo>/nuevo/page.tsx → Server Component (crear)
6. app/(dashboard)/<modulo>/[id]/page.tsx → Server Component (detalle)
7. app/(dashboard)/<modulo>/[id]/editar/page.tsx → Server Component (editar)
8. app/(dashboard)/<modulo>/_components/<modulo>-form.tsx → Client Component (formulario)
```

### Convenciones de nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Carpeta del módulo | `app/(dashboard)/<plural>/` | `surtidores/` |
| Server Actions | `actions.ts` dentro del módulo | `surtidores/actions.ts` |
| Componentes privados | `_components/<singular>-table.tsx` | `_components/surtidores-table.tsx` |
| Componentes privados | `_components/<singular>-form.tsx` | `_components/surtidor-form.tsx` |
| Esquema Zod | `lib/schemas/<singular>.ts` | `lib/schemas/surtidor.ts` |

---

## Paso 1: Crear Esquema Zod y Tipos

### Archivo: `lib/schemas/<modulo>.ts`

```typescript
import { z } from 'zod'

// ─── Schema para creación ───
export const createSchema = z.object({
  // Campos requeridos (con validaciones)
  campo_requerido: z.string().min(1, 'Este campo es obligatorio'),
  
  // Números (usar coerce porque formdata/envía strings)
  campo_numerico: z.coerce.number().positive('Debe ser positivo'),
  
  // Enums
  campo_enum: z.enum(['valor1', 'valor2'], {
    errorMap: () => ({ message: 'Selecciona una opción válida' }),
  }),
  
  // Booleanos
  campo_booleano: z.boolean().default(true),
  
  // Fechas
  campo_fecha: z.coerce.date({
    errorMap: () => ({ message: 'Fecha inválida' }),
  }),

  // Opcionales
  campo_opcional: z.string().optional(),
})

// ─── Schema para actualización (todos opcionales) ───
export const updateSchema = createSchema.partial()

// ─── Schema para filtros de búsqueda ───
export const filterSchema = z.object({
  search: z.string().optional(),
  activo: z.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
})

// ─── Tipos inferidos ───
export type CreateInput = z.infer<typeof createSchema>
export type UpdateInput = z.infer<typeof updateSchema>
export type FilterInput = z.infer<typeof filterSchema>
```

### Reglas Zod v4 (importantes)
- `z.coerce.number()` — Úsalo SIEMPRE para inputs de formulario (React Hook Form envía strings)
- `z.coerce.date()` — Para fechas
- `z.string().min(1, '...')` — Para campos requeridos (mejor que `.nonempty()` que no existe en v4)

---

## Paso 2: Crear Server Actions

### Archivo: `app/(dashboard)/<modulo>/actions.ts`

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createSchema, updateSchema } from '@/lib/schemas/<modulo>'
import type { CreateInput } from '@/lib/schemas/<modulo>'

// ─── CREATE ───
export async function createItem(formData: FormData) {
  const supabase = await createClient()

  // 1. Construir objeto desde FormData
  const rawData: CreateInput = {
    campo_requerido: formData.get('campo_requerido') as string,
    campo_numerico: formData.get('campo_numerico'),
    // ... etc
  }

  // 2. Validar con Zod
  const parsed = createSchema.safeParse(rawData)
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    // Redirigir con errores (usar searchParams)
    redirect(`/<modulo>/nuevo?error=${encodeURIComponent(JSON.stringify(errors))}`)
  }

  // 3. Obtener usuario autenticado
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 4. Insertar en Supabase
  const { error } = await supabase.from('<modulo>').insert({
    ...parsed.data,
    creado_por: user.id,
  })

  if (error) {
    redirect(`/<modulo>/nuevo?error=${encodeURIComponent(error.message)}`)
  }

  // 5. Revalidar y redirigir
  revalidatePath('/<modulo>')
  redirect('/<modulo>')
}

// ─── READ (fetch por ID) ───
export async function getItem(id: string | number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('<modulo>')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw new Error(error.message)
  return data
}

// ─── UPDATE ───
export async function updateItem(id: string | number, formData: FormData) {
  const supabase = await createClient()

  // ❌ NO usar Object.fromEntries(formData) — no maneja checkboxes ni números
  // Usar siempre formData.get() explícito como en CREATE:
  const rawData = {
    campo_requerido: formData.get('campo_requerido'),
    campo_numerico: formData.get('campo_numerico'),
    // ... mapear cada campo explícitamente
  }
  const parsed = updateSchema.safeParse(rawData)
  
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    redirect(`/<modulo>/${id}/editar?error=${encodeURIComponent(JSON.stringify(errors))}`)
  }

  const { error } = await supabase
    .from('<modulo>')
    .update(parsed.data)
    .eq('id', id)

  if (error) {
    redirect(`/<modulo>/${id}/editar?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/<modulo>')
  redirect('/<modulo>')
}

// ─── DELETE ───
export async function deleteItem(id: string | number) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('<modulo>')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error al eliminar:', error.message)
    throw new Error(error.message)
  }

  revalidatePath('/<modulo>')
}

// ⚠️ NOTA: `deleteItem` lanza error. Los componentes cliente deben
// llamarlo dentro de try/catch para evitar unhandled promise rejections.

// ─── TOGGLE (activar/desactivar) ───
export async function toggleItem(id: string | number, activo: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('<modulo>')
    .update({ activo: !activo })
    .eq('id', id)

  if (error) {
    console.error('Error al cambiar estado:', error.message)
    throw new Error(error.message)
  }

  revalidatePath('/<modulo>')
}
```

### Patrones Importantes en Server Actions

| Aspecto | Recomendación |
|---|---|
| **Validación** | Siempre validar con Zod `.safeParse()` (NUNCA confiar solo en validación del cliente) |
| **Autenticación** | Verificar `getUser()` en cada acción (no confiar solo en RLS) |
| **Errores** | Redirigir con searchParams `?error=...` y mostrar en el formulario |
| **Revalidación** | Usar `revalidatePath()` DESPUÉS de mutar datos |
| **Redirección** | Usar `redirect()` de `next/navigation` (NO `NextResponse.redirect`) |

---

## Paso 3: Crear Server Component (Lista)

### Archivo: `app/(dashboard)/<modulo>/page.tsx`

```typescript
import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { ModuloTableClient } from './_components/<modulo>-table'

// ⚠️ Los componentes de página en app router son Server Components por defecto
export default async function ModuloPage() {
  const supabase = await createClient()

  // 1. Fetch inicial (puede incluir joins)
  const { data: items } = await supabase
    .from('<modulo>')
    .select(`
      *,
      tabla_relacionada (
        campo_mostrar
      )
    `)
    .order('created_at', { ascending: false })

  // 2. Pasar datos serializables al Client Component
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Título Módulo</h1>
        {/* Botón para crear nuevo (enlace directo, no necesita JS) */}
        <a
          href="/<modulo>/nuevo"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Nuevo
        </a>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <ModuloTableClient initialData={items ?? []} />
      </Suspense>
    </div>
  )
}
```

---

## Paso 4: Crear Client Component (Tabla)

### Archivo: `app/(dashboard)/<modulo>/_components/<modulo>-table.tsx`

```typescript
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, ArrowUpDown } from 'lucide-react'

// ─── Tipos ───
interface ModuloItem {
  id: number | string
  // ... campos según el módulo
}

interface Props {
  initialData: ModuloItem[]
}

// ─── Acciones de tabla ───
async function handleDelete(id: number | string) {
  // Importar dinámicamente para evitar que el server action se bundlee
  const { deleteItem } = await import('../actions')
  if (!confirm('¿Estás seguro de eliminar este registro?')) return

  try {
    await deleteItem(id)
  } catch (error) {
    console.error('Error al eliminar:', error)
    alert('Ocurrió un error al eliminar el registro.')
  }
}

// ─── Tabla ───
export function ModuloTableClient({ initialData }: Props) {
  const router = useRouter()
  const [globalFilter, setGlobalFilter] = useState('')

  // Definir columnas (adaptar por módulo)
  const columns = useMemo<ColumnDef<ModuloItem>[]>(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      enableSorting: true,
    },
    {
      accessorKey: 'campo_mostrar',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre Columna
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'activo',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={row.original.activo ? 'default' : 'secondary'}>
          {row.original.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">            {/* ⚠️ Usar size="icon" (estándar ShadCN).
                El proyecto también soporta size="icon-sm" como variante
                personalizada en el botón, pero size="icon" es garantizado. */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/<modulo>/${row.original.id}/editar`)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
        </div>
      ),
    },
  ], [router])

  const table = useReactTable({
    data: initialData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: { pageSize: 10 },
    },
  })

  return (
    <div>
      {/* Filtro global */}
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} registros
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/<modulo>/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron registros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
```

---

## Paso 5: Crear Formulario (Crear/Editar)

### Archivo: `app/(dashboard)/<modulo>/_components/<modulo>-form.tsx`

```typescript
'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  createSchema,
  updateSchema,
  type CreateInput,
} from '@/lib/schemas/<modulo>'
import { createItem, updateItem } from '../actions'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// ─── Props ───
interface Props {
  mode: 'create' | 'edit'
  initialData?: Partial<CreateInput>  // para edición
  id?: string | number                 // para edición
}

// ─── Formulario ───
export function ModuloForm({ mode, initialData, id }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const form = useForm<CreateInput>({
    resolver: zodResolver(mode === 'create' ? createSchema : updateSchema as any),
    defaultValues: {
      // Valores por defecto o del registro existente
      campo_requerido: initialData?.campo_requerido ?? '',
      campo_numerico: initialData?.campo_numerico ?? undefined,
      activo: initialData?.activo ?? true,
    },
  })

  function onSubmit(data: CreateInput) {
    const formData = new FormData()
    formData.append('campo_requerido', data.campo_requerido)
    formData.append('campo_numerico', String(data.campo_numerico))

    startTransition(async () => {
      if (mode === 'create') {
        await createItem(formData)
      } else if (id) {
        await updateItem(id, formData)
      }
    })
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Nuevo Registro' : 'Editar Registro'}
        </CardTitle>
        <CardDescription>
          {mode === 'create'
            ? 'Completa los campos para crear un nuevo registro'
            : 'Modifica los campos del registro'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Errores del servidor */}
        {error && (
          <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo de texto */}
            <FormField
              control={form.control}
              name="campo_requerido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campo Requerido</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Valor..."
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo numérico */}
            <FormField
              control={form.control}
              name="campo_numerico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campo Numérico</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isPending}
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Select */}
            <FormField
              control={form.control}
              name="campo_enum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seleccionar</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="valor1">Valor 1</SelectItem>
                      <SelectItem value="valor2">Valor 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botones */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? 'Guardando...'
                  : mode === 'create'
                  ? 'Crear'
                  : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
```

---

## Paso 6: Crear Páginas de Detalle

### Nuevo: `app/(dashboard)/<modulo>/nuevo/page.tsx`

```typescript
import { ModuloForm } from '../_components/<modulo>-form'

export default async function NuevoModuloPage() {
  return <ModuloForm mode="create" />
}
```

### Detalle: `app/(dashboard)/<modulo>/[id]/page.tsx`

```typescript
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ModuloDetallePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: item } = await supabase
    .from('<modulo>')
    .select(`
      *,
      tabla_relacionada (
        campo_mostrar
      )
    `)
    .eq('id', id)
    .single()

  if (!item) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Detalle #{item.numero?.toString() ?? item.id}
        </h1>
        <a
          href={`/<modulo>/${id}/editar`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Editar
        </a>
      </div>

      {/* Tarjetas de detalle */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <dt className="text-sm text-muted-foreground">Campo</dt>
          <dd className="mt-1 text-lg font-medium">{item.campo}</dd>
        </div>
        {/* ... más campos */}
      </div>
    </div>
  )
}
```

### Editar: `app/(dashboard)/<modulo>/[id]/editar/page.tsx`

```typescript
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ModuloForm } from '../../_components/<modulo>-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarModuloPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: item } = await supabase
    .from('<modulo>')
    .select('*')
    .eq('id', id)
    .single()

  if (!item) notFound()

  return <ModuloForm mode="edit" initialData={item} id={id} />
}
```

---

## Paso 7: Conectar al Sidebar

El sidebar ya está configurado en `components/layout/app-sidebar.tsx` con los items de navegación:

```typescript
const navItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Surtidores', url: '/surtidores', icon: Fuel },
  { title: 'Ventas', url: '/ventas', icon: Receipt },
  { title: 'Alertas', url: '/alertas', icon: AlertTriangle },
  { title: 'Reportes', url: '/reportes', icon: BarChart3 },
]
```

**Si se agrega un nuevo módulo** (ej: Proveedores, Usuarios):
1. Agregar el item a `navItems`
2. Importar el icono de `lucide-react`

---

## Paso 8: Políticas RLS

Por cada módulo, las políticas RLS ya están definidas en `docs/database.md`. El agente debe:

1. Verificar que las políticas RLS existen en Supabase (deberían estar aplicadas del script SQL)
2. Las políticas se aplican a nivel de base de datos, no desde el frontend
3. El frontend solo necesita estar autenticado (el middleware ya redirige a `/login` si no hay sesión)

**Verificar políticas existentes para cada tabla:**

```sql
-- Ejemplo: Surtidores
-- SELECT: todos los usuarios autenticados
-- INSERT: solo admin
-- UPDATE: solo admin
-- DELETE: solo admin
```

---

## Checklist de Verificación

Por cada módulo CRUD implementado, verificar:

- [ ] Esquema Zod creado en `lib/schemas/<modulo>.ts`
- [ ] Tipos inferidos exportados (`type CreateInput`, `type UpdateInput`)
- [ ] Server Actions creadas en `app/(dashboard)/<modulo>/actions.ts`
- [ ] Server Component de lista en `app/(dashboard)/<modulo>/page.tsx`
- [ ] Client Component de tabla en `_components/<modulo>-table.tsx`
- [ ] Formulario reutilizable en `_components/<modulo>-form.tsx`
- [ ] Página de nuevo en `<modulo>/nuevo/page.tsx`
- [ ] Página de detalle en `<modulo>/[id]/page.tsx`
- [ ] Página de editar en `<modulo>/[id]/editar/page.tsx`
- [ ] Todos los imports usan el alias `@/` (ej: `@/components/ui/button`)
- [ ] El módulo aparece en el sidebar (si aplica)
- [ ] Server Actions usan `useTransition` + `startTransition` (no `useActionState`)
- [ ] Zod usa `.safeParse()` (no `.parse()`) para manejar errores gracefulmente
- [ ] `revalidatePath()` se llama después de mutaciones
- [ ] `redirect()` se usa para navegación post-mutación
- [ ] `pnpm tsc --noEmit` pasa sin errores
- [ ] `pnpm lint` pasa sin errores

---

## Ejemplo Completo: Módulo Surtidores

A continuación el ejemplo completo del módulo más importante del sistema.

### `lib/schemas/surtidor.ts`

```typescript
import { z } from 'zod'

export const createSurtidorSchema = z.object({
  numero: z.coerce.number().int().positive('El número debe ser positivo'),
  tipo_combustible_id: z.string().min(1, 'Selecciona un tipo de combustible'),
  capacidad: z.coerce.number().positive('La capacidad debe ser mayor a 0'),
  activo: z.boolean().default(true),
})

export const updateSurtidorSchema = createSurtidorSchema.partial()

export type CreateSurtidorInput = z.infer<typeof createSurtidorSchema>
export type UpdateSurtidorInput = z.infer<typeof updateSurtidorSchema>
```

### `app/(dashboard)/surtidores/actions.ts`

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import {
  createSurtidorSchema,
  updateSurtidorSchema,
} from '@/lib/schemas/surtidor'

export async function createSurtidor(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const rawData = {
    numero: formData.get('numero'),
    tipo_combustible_id: formData.get('tipo_combustible_id'),
    capacidad: formData.get('capacidad'),
    activo: formData.get('activo') === 'true',
  }

  const parsed = createSurtidorSchema.safeParse(rawData)
  if (!parsed.success) {
    const errors = JSON.stringify(parsed.error.flatten().fieldErrors)
    redirect(`/surtidores/nuevo?error=${encodeURIComponent(errors)}`)
  }

  const { error } = await supabase.from('surtidores').insert({
    ...parsed.data,
    nivel_litros: parsed.data.capacidad,  // inicial = capacidad
    nivel: 'lleno',
    creado_por: user.id,
  })

  if (error) redirect(`/surtidores/nuevo?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/surtidores')
  redirect('/surtidores')
}

export async function updateSurtidor(id: number, formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    numero: formData.get('numero'),
    tipo_combustible_id: formData.get('tipo_combustible_id'),
    capacidad: formData.get('capacidad'),
    activo: formData.get('activo') === 'true',
  }

  const parsed = updateSurtidorSchema.safeParse(rawData)
  if (!parsed.success) {
    const errors = JSON.stringify(parsed.error.flatten().fieldErrors)
    redirect(`/surtidores/${id}/editar?error=${encodeURIComponent(errors)}`)
  }

  const { error } = await supabase
    .from('surtidores')
    .update(parsed.data)
    .eq('id', id)

  if (error) redirect(`/surtidores/${id}/editar?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/surtidores')
  redirect('/surtidores')
}

export async function deleteSurtidor(id: number) {
  const supabase = await createClient()

  const { error } = await supabase.from('surtidores').delete().eq('id', id)

  if (error) {
    console.error('Error al eliminar:', error.message)
    throw new Error(error.message)
  }

  revalidatePath('/surtidores')
}
```

### `app/(dashboard)/surtidores/page.tsx`

```typescript
import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { SurtidoresTable } from './_components/surtidores-table'
import { Fuel, Plus } from 'lucide-react'

export default async function SurtidoresPage() {
  const supabase = await createClient()

  const { data: surtidores } = await supabase
    .from('surtidores')
    .select(`
      *,
      tipos_combustible (
        nombre
      )
    `)
    .order('numero', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Fuel className="size-6" />
            Surtidores
          </h1>
          <p className="text-muted-foreground">
            Gestión de surtidores de combustible
          </p>
        </div>
        <a
          href="/surtidores/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-4" />
          Nuevo Surtidor
        </a>
      </div>

      <Suspense fallback={<div>Cargando surtidores...</div>}>
        <SurtidoresTable initialData={surtidores ?? []} />
      </Suspense>
    </div>
  )
}
```

### `app/(dashboard)/surtidores/_components/surtidores-table.tsx`

```typescript
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Pencil,
  Trash2,
  ArrowUpDown,
  Fuel,
} from 'lucide-react'
import { deleteSurtidor } from '../actions'

interface Surtidor {
  id: number
  numero: number
  tipo_combustible_id: string
  capacidad: number
  nivel_litros: number
  nivel: string
  activo: boolean
  tipos_combustible?: { nombre: string } | null
}

interface Props {
  initialData: Surtidor[]
}

const nivelColors: Record<string, string> = {
  lleno: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  medio: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  bajo: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  vacio: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
}

const nivelLabels: Record<string, string> = {
  lleno: 'Lleno',
  medio: 'Medio',
  bajo: 'Bajo',
  vacio: 'Vacío',
}

export function SurtidoresTable({ initialData }: Props) {
  const router = useRouter()
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<Surtidor>[]>(() => [
    { accessorKey: 'numero', header: 'N°', enableSorting: true },
    {
      accessorKey: 'tipos_combustible.nombre',
      header: 'Combustible',
      cell: ({ row }) => row.original.tipos_combustible?.nombre ?? '—',
    },
    {
      header: 'Capacidad',
      cell: ({ row }) => `${row.original.capacidad} L`,
    },
    {
      header: 'Nivel Actual',
      cell: ({ row }) => `${row.original.nivel_litros} L`,
    },
    {
      accessorKey: 'nivel',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nivel
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge className={nivelColors[row.original.nivel]}>
          {nivelLabels[row.original.nivel]}
        </Badge>
      ),
    },
    {
      accessorKey: 'activo',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={row.original.activo ? 'default' : 'secondary'}>
          {row.original.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/surtidores/${row.original.id}/editar`)
            }}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={async (e) => {
              e.stopPropagation()
              if (!confirm('¿Eliminar este surtidor?')) return
              try {
                await deleteSurtidor(row.original.id)
                router.refresh()
              } catch (error) {
                console.error('Error al eliminar:', error)
                alert('Ocurrió un error al eliminar el surtidor.')
              }
            }}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ], [router])

  const table = useReactTable({
    data: initialData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Buscar surtidor..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} surtidores
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/surtidores/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay surtidores registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
```

---

## Ejemplo Completo: Módulo Ventas (con relaciones)

Las ventas son el módulo más complejo porque involucran:
- Relación con `surtidores`, `tipos_combustible`, `profiles`
- Relación 1:N con `pagos` (múltiples métodos de pago)
- Precio calculado desde `precios_combustible`
- Validación: suma de pagos = total de venta

### Orden de implementación para módulos con relaciones

```
1. tipos_combustible (catálogo, previo en BD)
2. metodos_pago (catálogo, previo en BD)
3. surtidores (CRUD completo)
4. proveedores (CRUD simple)
5. precios_combustible (CRUD)
6. abastecimientos (CRUD con relaciones)
7. turnos (CRUD con operador/supervisor)
8. ventas (CRUD + pagos  — el más complejo)
9. alertas (lectura + resolver, creado por triggers)
10. reportes (vistas SQL predefinidas, solo lectura)
```

---

> **Siguiente paso:** Después de implementar los módulos CRUD, conectar el Dashboard con datos reales de Supabase para mostrar estadísticas en vivo.
