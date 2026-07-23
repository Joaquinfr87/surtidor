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
import { ArrowUpDown, Search, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { resolverAlerta } from '../actions'
import { cn } from '@/lib/utils'

interface Alerta {
  id: number
  surtidor_id: number
  tipo: string
  nivel: string
  activa: boolean
  creado_en: string
  resuelta_en: string | null
  surtidores?: { numero: number; tipos_combustible?: { nombre: string } | null } | null
}

interface Props {
  initialData: Alerta[]
}

export function AlertasTable({ initialData }: Props) {
  const router = useRouter()
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<Alerta>[]>(() => [
    {
      accessorKey: 'creado_en',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Fecha
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.creado_en)
        return (
          <span className="text-nowrap text-muted-foreground">
            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )
      },
    },
    {
      header: 'Surtidor',
      cell: ({ row }) => <span className="font-medium">N° {row.original.surtidores?.numero ?? '—'}</span>,
    },
    {
      header: 'Combustible',
      cell: ({ row }) => row.original.surtidores?.tipos_combustible?.nombre ?? '—',
    },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => (
        <Badge
          variant={row.original.tipo === 'critico' ? 'destructive' : 'secondary'}
          className={cn(
            'transition-all',
            row.original.tipo === 'critico' && 'animate-pulse'
          )}
        >
          {row.original.tipo === 'critico' ? 'Crítico' : 'Bajo'}
        </Badge>
      ),
    },
    {
      accessorKey: 'nivel',
      header: 'Nivel',
      cell: ({ row }) => <span className="font-mono">{row.original.nivel}</span>,
    },
    {
      accessorKey: 'activa',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={row.original.activa ? 'destructive' : 'default'} className="transition-all">
          {row.original.activa ? 'Activa' : 'Resuelta'}
        </Badge>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        row.original.activa ? (
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={async (e) => {
            e.stopPropagation()
            toast.custom((t) => (
              <div className="rounded-lg border bg-popover p-4 shadow-md">
                <p className="mb-3 text-sm font-medium">¿Resolver alerta?</p>
                <p className="mb-3 text-xs text-muted-foreground">La alerta será marcada como resuelta.</p>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>Cancelar</Button>
                  <Button size="sm" onClick={async () => {
                    toast.dismiss(t)
                    try {
                      await resolverAlerta(row.original.id)
                      router.refresh()
                      toast.success('Alerta resuelta correctamente')
                    } catch {
                      toast.error('Error al resolver la alerta')
                    }
                  }}>Resolver</Button>
                </div>
              </div>
            ), { duration: 10000 })
          }}>
            <CheckCircle2 className="mr-1 size-3" />
            Resolver
          </Button>
        ) : null
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
          <Input placeholder="Buscar alerta..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm pl-9" />
        </div>
        <div className="text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} alertas</div>
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
                    icon={<AlertTriangle className="size-8 text-muted-foreground/60" />}
                    title="No hay alertas registradas"
                    description="Las alertas aparecerán cuando los niveles de combustible sean bajos."
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
