import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, ArrowLeft, Fuel, Gauge, Droplets, Power, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

const nivelConfig: Record<string, { label: string; color: string; barColor: string }> = {
  lleno: { label: 'Lleno', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', barColor: 'bg-green-500' },
  medio: { label: 'Medio', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', barColor: 'bg-yellow-500' },
  bajo: { label: 'Bajo', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300', barColor: 'bg-orange-500' },
  vacio: { label: 'Vacío', color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300', barColor: 'bg-red-500' },
}

export default async function SurtidorDetallePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: surtidor } = await supabase
    .from('surtidores')
    .select('*, tipos_combustible(nombre)')
    .eq('id', id)
    .single()

  if (!surtidor) notFound()

  const nivel = nivelConfig[surtidor.nivel] ?? nivelConfig.medio
  const porcentaje = Math.round((surtidor.nivel_litros / surtidor.capacidad) * 100)

  const detailItems = [
    { label: 'Número', value: surtidor.numero, icon: Hash },
    { label: 'Combustible', value: surtidor.tipos_combustible?.nombre ?? '—', icon: Fuel },
    { label: 'Capacidad', value: `${surtidor.capacidad.toLocaleString()} L`, icon: Gauge },
    { label: 'Nivel Actual', value: `${surtidor.nivel_litros.toLocaleString()} L`, icon: Droplets },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/surtidores">
            <Button variant="ghost" size="icon" className="size-8 rounded-full">
              <ArrowLeft className="size-4" />
            </Button>
          </a>
          <h1 className="text-2xl font-bold tracking-tight">Surtidor N° {surtidor.numero}</h1>
        </div>
        <a href={`/surtidores/${id}/editar`}>
          <Button>
            <Pencil className="mr-2 size-4" />
            Editar
          </Button>
        </a>
      </div>

      {/* Progress bar for fuel level */}
      <Card className="animate-fade-in overflow-hidden">
        <CardContent className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Nivel de Combustible</span>
            <Badge className={nivel.color}>{nivel.label}</Badge>
          </div>
          <div className="mb-1 flex items-center justify-between text-sm text-muted-foreground">
            <span>{surtidor.nivel_litros.toLocaleString()} L</span>
            <span>{porcentaje}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full rounded-full transition-all duration-1000 ease-out', nivel.barColor)}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="animate-stagger grid gap-4 md:grid-cols-2">
        {detailItems.map((item) => (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
              <item.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estado</CardTitle>
            <Power className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={surtidor.activo ? 'default' : 'secondary'} className="px-3 py-1">
              {surtidor.activo ? 'Activo' : 'Inactivo'}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
