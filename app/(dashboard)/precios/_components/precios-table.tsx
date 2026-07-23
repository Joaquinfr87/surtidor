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
import { Pencil, Trash2, ArrowUpDown, Search, DollarSign } from 'lucide-react'
import { deletePrecio } from '../actions'

interface Precio {
  id: number
  tipo_combustible_id: string
  precio_por_litro: number
  fecha_inicio: string
  fecha_fin: string | null
  tipos_combustible?: { nombre: string } | null
}

interface Props {
  initialData: Precio[]
}

export function PreciosTable({ initialData }: Props) {
  const router = useRouter()
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<Precio>[]>(() => [
    {
      accessorKey: 'tipos_combustible.nombre',
      header: 'Combustible',
      cell: ({ row }) => <span className="font-medium">{row.original.tipos_combustible?.nombre ?? '—'}</span>,
    },
    {
      accessorKey: 'precio_por_litro',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Precio/L
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-mono font-medium">Bs. {(row.original.precio_por_litro ?? 0).toFixed(2)}</span>,
    },
    {
      accessorKey: 'fecha_inicio',
      header: 'Desde',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{new Date(row.original.fecha_inicio).toLocaleDateString()}</span>
      ),
    },
    {
      accessorKey: 'fecha_fin',
      header: 'Hasta',
      cell: ({ row }) => row.original.fecha_fin
        ? <span className="text-muted-foreground">{new Date(row.original.fecha_fin).toLocaleDateString()}</span>
        : <Badge variant="outline" className="text-xs">Vigente</Badge>,
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-8" onClick={(e) => { e.stopPropagation(); router.push(`/precios/${row.original.id}/editar`) }}>
            <Pencil className="size-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={async (e) => {
            e.stopPropagation()
            toast.custom((t) => (
              <div className="rounded-lg border bg-popover p-4 shadow-md">
                <p className="mb-3 text-sm font-medium">¿Eliminar este precio?</p>
                <p className="mb-3 text-xs text-muted-foreground">Esta acción no se puede deshacer.</p>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>Cancelar</Button>
                  <Button size="sm" variant="destructive" onClick={async () => {
                    toast.dismiss(t)
                    try {
                      await deletePrecio(row.original.id)
                      router.refresh()
                      toast.success('Precio eliminado correctamente')
                    } catch {
                      toast.error('Error al eliminar el precio')
                    }
                  }}>Eliminar</Button>
                </div>
              </div>
            ), { duration: 10000 })
          }}>
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
          <Input placeholder="Buscar precio..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm pl-9" />
        </div>
        <div className="text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} registros</div>
      </div>

      <div className="rounded-xl border bg-card transition-all">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow key={row.id} className="cursor-pointer transition-colors hover:bg-muted/60 animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }} onClick={() => router.push(`/precios/${row.original.id}`)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <EmptyState
                    icon={<DollarSign className="size-8 text-muted-foreground/60" />}
                    title="No hay precios registrados"
                    description="Los precios aparecerán aquí una vez que se configuren."
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Anterior</Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Siguiente</Button>
        </div>
      </div>
    </div>
  )
}
