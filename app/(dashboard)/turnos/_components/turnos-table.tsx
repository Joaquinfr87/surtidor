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
import { ArrowUpDown, Search, Clock, Lock, Unlock } from 'lucide-react'
import { closeTurno } from '../actions'

interface Turno {
  id: string
  operador_id: string
  supervisor_id: string | null
  inicio: string
  fin: string | null
  ventas_total: number | null
  litros_total: number | null
  cerrado: boolean
  operador?: { nombre_completo: string } | null
  supervisor?: { nombre_completo: string } | null
}

interface Props {
  initialData: Turno[]
}

export function TurnosTable({ initialData }: Props) {
  const router = useRouter()
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<Turno>[]>(() => [
    {
      accessorKey: 'inicio',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Inicio
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.inicio)
        return (
          <span className="text-nowrap text-muted-foreground">
            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )
      },
    },
    {
      header: 'Operador',
      cell: ({ row }) => <span className="font-medium">{row.original.operador?.nombre_completo ?? '—'}</span>,
    },
    {
      header: 'Supervisor',
      cell: ({ row }) => row.original.supervisor?.nombre_completo ?? '—',
    },
    {
      accessorKey: 'ventas_total',
      header: 'Ventas',
      cell: ({ row }) => <span className="font-mono">Bs. {(row.original.ventas_total ?? 0).toFixed(2)}</span>,
    },
    {
      accessorKey: 'litros_total',
      header: 'Litros',
      cell: ({ row }) => <span className="font-mono">{row.original.litros_total ?? 0} L</span>,
    },
    {
      accessorKey: 'cerrado',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={row.original.cerrado ? 'secondary' : 'default'} className="transition-all">
          {row.original.cerrado ? (
            <span className="flex items-center gap-1"><Lock className="size-3" /> Cerrado</span>
          ) : (
            <span className="flex items-center gap-1"><Unlock className="size-3" /> Abierto</span>
          )}
        </Badge>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {!row.original.cerrado && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={async (e) => {
              e.stopPropagation()
              toast.custom((t) => (
                <div className="rounded-lg border bg-popover p-4 shadow-md">
                  <p className="mb-3 text-sm font-medium">¿Cerrar este turno?</p>
                  <p className="mb-3 text-xs text-muted-foreground">El turno será cerrado y no podrá modificarse.</p>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>Cancelar</Button>
                    <Button size="sm" onClick={async () => {
                      toast.dismiss(t)
                      try {
                        await closeTurno(row.original.id)
                        router.refresh()
                        toast.success('Turno cerrado correctamente')
                      } catch {
                        toast.error('Error al cerrar el turno')
                      }
                    }}>Cerrar Turno</Button>
                  </div>
                </div>
              ), { duration: 10000 })
            }}>
              <Lock className="mr-1 size-3" />
              Cerrar
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
          <Input placeholder="Buscar turno..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm pl-9" />
        </div>
        <div className="text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} turnos</div>
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
                    icon={<Clock className="size-8 text-muted-foreground/60" />}
                    title="No hay turnos registrados"
                    description="Los turnos aparecerán aquí una vez que se creen."
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
