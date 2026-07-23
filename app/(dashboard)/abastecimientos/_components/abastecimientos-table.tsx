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
import { EmptyState } from '@/components/ui/empty-state'
import { ArrowUpDown, Search, Trash2, Truck } from 'lucide-react'
import { deleteAbastecimiento } from '../actions'

interface Abastecimiento {
  id: number
  surtidor_id: number
  proveedor_id: number
  tipo_combustible_id: string
  litros: number
  precio_por_litro: number
  costo_total: number
  factura: string | null
  fecha: string
  surtidores?: { numero: number } | null
  proveedores?: { nombre: string } | null
  tipos_combustible?: { nombre: string } | null
}

interface Props {
  initialData: Abastecimiento[]
}

export function AbastecimientosTable({ initialData }: Props) {
  const router = useRouter()
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<Abastecimiento>[]>(() => [
    {
      accessorKey: 'fecha',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Fecha
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-nowrap text-muted-foreground">
          {new Date(row.original.fecha).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Surtidor',
      cell: ({ row }) => <span className="font-medium">N° {row.original.surtidores?.numero ?? row.original.surtidor_id}</span>,
    },
    {
      header: 'Proveedor',
      cell: ({ row }) => row.original.proveedores?.nombre ?? '—',
    },
    {
      header: 'Combustible',
      cell: ({ row }) => row.original.tipos_combustible?.nombre ?? '—',
    },
    {
      accessorKey: 'litros',
      header: 'Litros',
      cell: ({ row }) => <span className="font-mono">{row.original.litros.toLocaleString()} L</span>,
    },
    {
      accessorKey: 'costo_total',
      header: 'Costo',
      cell: ({ row }) => <span className="font-mono font-medium">Bs. {(row.original.costo_total ?? 0).toFixed(2)}</span>,
    },
    {
      accessorKey: 'factura',
      header: 'Factura',
      cell: ({ row }) => row.original.factura ?? <span className="text-muted-foreground/50">—</span>,
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={async (e) => {
          e.stopPropagation()
          toast.custom((t) => (
            <div className="rounded-lg border bg-popover p-4 shadow-md">
              <p className="mb-3 text-sm font-medium">¿Eliminar este abastecimiento?</p>
              <p className="mb-3 text-xs text-muted-foreground">Esta acción no se puede deshacer.</p>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>Cancelar</Button>
                <Button size="sm" variant="destructive" onClick={async () => {
                  toast.dismiss(t)
                  try {
                    await deleteAbastecimiento(row.original.id)
                    router.refresh()
                    toast.success('Abastecimiento eliminado correctamente')
                  } catch {
                    toast.error('Error al eliminar el abastecimiento')
                  }
                }}>Eliminar</Button>
              </div>
            </div>
          ), { duration: 10000 })
        }}>
          <Trash2 className="size-4" />
          <span className="sr-only">Eliminar</span>
        </Button>
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
          <Input placeholder="Buscar abastecimiento..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm pl-9" />
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
                <TableRow key={row.id} className="transition-colors hover:bg-muted/60 animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <EmptyState
                    icon={<Truck className="size-8 text-muted-foreground/60" />}
                    title="No hay abastecimientos registrados"
                    description="Los abastecimientos aparecerán aquí una vez que se registren."
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
