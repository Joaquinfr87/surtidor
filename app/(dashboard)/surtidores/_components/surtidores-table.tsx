'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Fuel,
  Pencil,
  Trash2,
  Search,
  Droplets,
  Gauge,
  Power,
  ChevronLeft,
  ChevronRight,
  Percent,
} from 'lucide-react'
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

const nivelConfig: Record<string, { label: string; color: string; barColor: string; iconColor: string }> = {
  lleno: {
    label: 'Lleno',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    barColor: 'bg-green-500',
    iconColor: 'text-green-500',
  },
  medio: {
    label: 'Medio',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    barColor: 'bg-yellow-500',
    iconColor: 'text-yellow-500',
  },
  bajo: {
    label: 'Bajo',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    barColor: 'bg-orange-500',
    iconColor: 'text-orange-500',
  },
  vacio: {
    label: 'Vacío',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    barColor: 'bg-red-500',
    iconColor: 'text-red-500',
  },
}

const fuelTypeColors: Record<string, { bg: string; icon: string }> = {
  gasolina_premium: { bg: 'from-emerald-500/20 to-emerald-600/10', icon: 'text-emerald-500' },
  gasolina_regular: { bg: 'from-sky-500/20 to-sky-600/10', icon: 'text-sky-500' },
  diesel: { bg: 'from-amber-500/20 to-amber-600/10', icon: 'text-amber-500' },
  diesel_premium: { bg: 'from-orange-500/20 to-orange-600/10', icon: 'text-orange-500' },
  kerosene: { bg: 'from-rose-500/20 to-rose-600/10', icon: 'text-rose-500' },
}

const PAGE_SIZE = 12

function SurtidorCard({
  surtidor,
  router,
}: {
  surtidor: Surtidor
  router: ReturnType<typeof useRouter>
}) {
  const nivel = nivelConfig[surtidor.nivel] ?? nivelConfig.medio
  const porcentaje = Math.round((surtidor.nivel_litros / surtidor.capacidad) * 100)
  const fuelColor = fuelTypeColors[surtidor.tipo_combustible_id] ?? fuelTypeColors.gasolina_regular

  return (
    <div
      className="group relative animate-fade-in cursor-pointer overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      style={{ animationDelay: `${surtidor.numero * 40}ms` }}
      onClick={() => router.push(`/surtidores/${surtidor.id}`)}
    >
      {/* Top gradient accent */}
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80 transition-opacity duration-300 group-hover:opacity-100',
          surtidor.activo
            ? nivel.barColor
            : 'bg-muted-foreground/20'
        )}
      />

      {/* Fuel type background accent */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100',
          fuelColor.bg
        )}
      />

      <div className="relative p-5">
        {/* Header: Number + Status + Actions */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex size-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110',
              surtidor.activo
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            )}>
              <Fuel className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight tracking-tight">
                N° {surtidor.numero}
              </h3>
              <p className="text-xs text-muted-foreground">
                {surtidor.tipos_combustible?.nombre ?? 'Sin combustible'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Badge
              variant={surtidor.activo ? 'default' : 'secondary'}
              className="pointer-events-none h-6 text-[10px] uppercase tracking-wider transition-all"
            >
              <Power className={cn(
                'mr-1 size-2.5',
                surtidor.activo ? 'text-green-300' : 'text-muted-foreground'
              )} />
              {surtidor.activo ? 'Activo' : 'Inactivo'}
            </Badge>

            <div className="ml-1 flex opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/surtidores/${surtidor.id}/editar`)
                }}
              >
                <Pencil className="size-3.5" />
                <span className="sr-only">Editar</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-destructive hover:text-destructive"
                onClick={async (e) => {
                  e.stopPropagation()
                  toast.custom((t) => (
                    <div className="rounded-lg border bg-popover p-4 shadow-md">
                      <p className="mb-2 text-sm font-medium">¿Eliminar surtidor N° {surtidor.numero}?</p>
                      <p className="mb-3 text-xs text-muted-foreground">Esta acción no se puede deshacer.</p>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>Cancelar</Button>
                        <Button size="sm" variant="destructive" onClick={async () => {
                          toast.dismiss(t)
                          try {
                            await deleteSurtidor(surtidor.id)
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
                <Trash2 className="size-3.5" />
                <span className="sr-only">Eliminar</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-4">
          {/* Fuel gauge visual */}
          <div className="flex items-center gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Droplets className={cn('size-3', nivel.iconColor)} />
                  <span className="font-medium">{surtidor.nivel_litros.toLocaleString()} L</span>
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Gauge className="size-3 text-muted-foreground/60" />
                  <span>{surtidor.capacidad.toLocaleString()} L</span>
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-1000 ease-out',
                    nivel.barColor
                  )}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Badge className={cn('pointer-events-none text-[10px]', nivel.color)}>
                  {nivel.label}
                </Badge>
                <span className="flex items-center gap-1 text-xs font-medium tabular-nums text-muted-foreground">
                  <Percent className="size-3 text-muted-foreground/50" />
                  {porcentaje}%
                </span>
              </div>
            </div>
          </div>

          {/* Footer stats */}
          <div className="flex items-center justify-end border-t pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              Ver detalle
              <ChevronRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SurtidoresTable({ initialData }: Props) {
  const router = useRouter()
  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(0)

  const filteredData = useMemo(() => {
    if (!globalFilter) return initialData
    const q = globalFilter.toLowerCase()
    return initialData.filter(
      (s) =>
        String(s.numero).includes(q) ||
        s.tipos_combustible?.nombre?.toLowerCase().includes(q) ||
        s.nivel.toLowerCase().includes(q) ||
        (s.activo ? 'activo' : 'inactivo').includes(q)
    )
  }, [initialData, globalFilter])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages - 1)
  const pageData = filteredData.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

  // Reset page when filter changes
  const handleFilterChange = (value: string) => {
    setGlobalFilter(value)
    setPage(0)
  }

  return (
    <div className="animate-fade-in">
      {/* Search bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar surtidor por número, combustible, nivel..."
            value={globalFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="max-w-md pl-9"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium tabular-nums">{filteredData.length}</span>
          <span>surtidor{filteredData.length !== 1 ? 'es' : ''}</span>
        </div>
      </div>

      {/* Grid */}
      {pageData.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pageData.map((surtidor) => (
            <SurtidorCard key={surtidor.id} surtidor={surtidor} router={router} />
          ))}
        </div>
      ) : (
        <div className="py-12">
          <EmptyState
            icon={<Fuel className="size-10 text-muted-foreground/60" />}
            title={
              globalFilter
                ? 'Sin resultados'
                : 'No hay surtidores registrados'
            }
            description={
              globalFilter
                ? `No se encontraron surtidores con "${globalFilter}"`
                : 'Agrega un nuevo surtidor para comenzar.'
            }
            action={
              globalFilter ? (
                <Button variant="outline" onClick={() => setGlobalFilter('')}>
                  Limpiar búsqueda
                </Button>
              ) : undefined
            }
          />
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Página {currentPage + 1} de {totalPages}
            <span className="ml-2 text-muted-foreground/60">
              ({filteredData.length} total)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="mr-1 size-3.5" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Siguiente
              <ChevronRight className="ml-1 size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
