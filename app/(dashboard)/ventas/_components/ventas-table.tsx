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
import { ArrowUpDown, Receipt, Eye, Ban, Search } from 'lucide-react'
import { anularVenta } from '../actions'

interface Venta {
  id: string
  surtidor_id: number
  tipo_combustible_id: string
  litros: number
  precio_unitario: number
  subtotal: number
  impuesto: number
  total: number
  anulada: boolean
  fecha: string
  surtidores?: { numero: number } | null
  tipos_combustible?: { nombre: string } | null
  profiles?: { nombre_completo: string } | null
}

interface Props {
  initialData: Venta[]
}

export function VentasTable({ initialData }: Props) {
  const router = useRouter()
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<Venta>[]>(() => [
    {
      accessorKey: 'fecha',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Fecha
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.fecha)
        return (
          <span className="text-nowrap text-muted-foreground">
            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )
      },
    },
    {
      header: 'Surtidor',
      cell: ({ row }) => (
        <span className="font-medium">N° {row.original.surtidores?.numero ?? '—'}</span>
      ),
    },
    {
      header: 'Combustible',
      cell: ({ row }) => row.original.tipos_combustible?.nombre ?? '—',
    },
    {
      accessorKey: 'litros',
      header: 'Litros',
      cell: ({ row }) => `${row.original.litros} L`,
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => (
        <span className="font-mono font-medium">Bs. {(row.original.total ?? 0).toFixed(2)}</span>
      ),
    },
    {
      header: 'Operador',
      cell: ({ row }) => row.original.profiles?.nombre_completo ?? '—',
    },
    {
      accessorKey: 'anulada',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={row.original.anulada ? 'destructive' : 'default'} className="transition-all">
          {row.original.anulada ? 'Anulada' : 'Vigente'}
        </Badge>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-8" onClick={(e) => { e.stopPropagation(); router.push(`/ventas/${row.original.id}`) }}>
            <Eye className="size-4" />
            <span className="sr-only">Ver</span>
          </Button>
          {!row.original.anulada && (
            <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={async (e) => {
              e.stopPropagation()
              toast.custom((t) => (
                <div className="rounded-lg border bg-popover p-4 shadow-md">
                  <p className="mb-3 text-sm font-medium">¿Anular esta venta?</p>
                  <p className="mb-3 text-xs text-muted-foreground">Esta acción no se puede deshacer.</p>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>Cancelar</Button>
                    <Button size="sm" variant="destructive" onClick={async () => {
                      toast.dismiss(t)
                      try {
                        await anularVenta(row.original.id)
                        router.refresh()
                        toast.success('Venta anulada correctamente')
                      } catch {
                        toast.error('Error al anular la venta')
                      }
                    }}>Anular</Button>
                  </div>
                </div>
              ), { duration: 10000 })
            }}>
              <Ban className="size-4" />
              <span className="sr-only">Anular</span>
            </Button>
          )}
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
            placeholder="Buscar venta..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} ventas
        </div>
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
                <TableRow
                  key={row.id}
                  className="cursor-pointer transition-colors hover:bg-muted/60 animate-fade-in"
                  style={{ animationDelay: `${idx * 30}ms` }}
                  onClick={() => router.push(`/ventas/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <EmptyState
                    icon={<Receipt className="size-8 text-muted-foreground/60" />}
                    title="No hay ventas registradas"
                    description="Las ventas aparecerán aquí una vez que se registren."
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
