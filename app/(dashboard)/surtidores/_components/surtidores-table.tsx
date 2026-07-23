'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  type ColumnDef,
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
import { EmptyState } from '@/components/ui/empty-state'
import { Pencil, Trash2, ArrowUpDown, Search, Fuel } from 'lucide-react'
import { deleteSurtidor } from '../actions'
import { cn } from '@/lib/utils'

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

const nivelConfig: Record<string, { label: string; color: string; barColor: string }> = {
  lleno: { label: 'Lleno', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', barColor: 'bg-green-500' },
  medio: { label: 'Medio', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', barColor: 'bg-yellow-500' },
  bajo: { label: 'Bajo', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300', barColor: 'bg-orange-500' },
  vacio: { label: 'Vacío', color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300', barColor: 'bg-red-500' },
}

export function SurtidoresTable({ initialData }: Props) {
  const router = useRouter()
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<Surtidor>[]>(() => [
    {
      accessorKey: 'numero',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          N°
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium">N° {row.original.numero}</span>,
    },
    {
      accessorKey: 'tipos_combustible.nombre',
      header: 'Combustible',
      cell: ({ row }) => row.original.tipos_combustible?.nombre ?? '—',
    },
    {
      header: 'Capacidad',
      cell: ({ row }) => <span className="font-mono">{row.original.capacidad.toLocaleString()} L</span>,
    },
    {
      header: 'Nivel Actual',
      cell: ({ row }) => {
        const pct = Math.round((row.original.nivel_litros / row.original.capacidad) * 100)
        const config = nivelConfig[row.original.nivel] ?? nivelConfig.medio
        return (
          <div className="flex items-center gap-3">
            <span className="w-16 font-mono text-sm">{row.original.nivel_litros.toLocaleString()} L</span>
            <div className="hidden h-2 w-16 overflow-hidden rounded-full bg-muted md:block">
              <div className={cn('h-full rounded-full transition-all duration-500', config.barColor)} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'nivel',
      header: 'Nivel',
      cell: ({ row }) => {
        const config = nivelConfig[row.original.nivel] ?? nivelConfig.medio
        return <Badge className={config.color}>{config.label}</Badge>
      },
    },
    {
      accessorKey: 'activo',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={row.original.activo ? 'default' : 'secondary'} className="transition-all">
          {row.original.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/surtidores/${row.original.id}/editar`)
            }}
          >
            <Pencil className="size-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive hover:text-destructive"
            onClick={async (e) => {
              e.stopPropagation()
              toast.custom((t) => (
                <div className="rounded-lg border bg-popover p-4 shadow-md">
                  <p className="mb-3 text-sm font-medium">¿Eliminar surtidor N° {row.original.numero}?</p>
                  <p className="mb-3 text-xs text-muted-foreground">Esta acción no se puede deshacer.</p>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>Cancelar</Button>
                    <Button size="sm" variant="destructive" onClick={async () => {
                      toast.dismiss(t)
                      try {
                        await deleteSurtidor(row.original.id)
                        router.refresh()
                        toast.success('Surtidor eliminado correctamente')
                      } catch {
                        toast.error('Error al eliminar el surtidor')
                      }
                    }}>Eliminar</Button>
                  </div>
                </div>
              ), { duration: 10000 })
            }}
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Eliminar</span>
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
    <div className="animate-fade-in">
      <div className="flex items-center justify-between py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar surtidor..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} surtidores
        </div>
      </div>

      <div className="rounded-xl border bg-card transition-all">
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
              table.getRowModel().rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer transition-colors hover:bg-muted/60 animate-fade-in"
                  style={{ animationDelay: `${idx * 30}ms` }}
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
                <TableCell colSpan={columns.length}>
                  <EmptyState
                    icon={<Fuel className="size-8 text-muted-foreground/60" />}
                    title="No hay surtidores registrados"
                    description="Agrega un nuevo surtidor para comenzar."
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
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
    </div>
  )
}
