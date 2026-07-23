import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DashboardSkeleton } from '@/components/ui/page-skeleton'
import {
  Fuel,
  Receipt,
  AlertTriangle,
  DollarSign,
  Truck,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { VentasPorDiaChart } from '@/components/charts/ventas-por-dia'
import { VentasPorCombustibleChart } from '@/components/charts/ventas-por-combustible'
import { NivelesSurtidoresChart } from '@/components/charts/niveles-surtidores'

async function DashboardCharts() {
  const supabase = await createClient()

  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 7)

  const [ventasPorDia, ventasPorCombustible, surtidores] = await Promise.all([
    supabase
      .from('ventas')
      .select('fecha, litros, total')
      .eq('anulada', false)
      .gte('fecha', sevenDaysAgo.toISOString())
      .order('fecha'),
    supabase
      .from('ventas')
      .select('tipo_combustible_id, litros, total')
      .eq('anulada', false)
      .gte('fecha', sevenDaysAgo.toISOString()),
    supabase
      .from('surtidores')
      .select('numero, tipo_combustible_id, capacidad, nivel_litros, nivel')
      .eq('activo', true)
      .order('numero'),
  ])

  const ventasPorDiaAgrupadas = (ventasPorDia.data || []).reduce<Record<string, { dia: string; total_ventas: number; total_litros: number; total_ingresos: number }>>((acc, v) => {
    const dia = v.fecha.split('T')[0]
    if (!acc[dia]) {
      acc[dia] = { dia, total_ventas: 0, total_litros: 0, total_ingresos: 0 }
    }
    acc[dia].total_ventas += 1
    acc[dia].total_litros += Number(v.litros)
    acc[dia].total_ingresos += Number(v.total)
    return acc
  }, {})

  const ventasPorDiaArr = Object.values(ventasPorDiaAgrupadas).sort((a, b) => a.dia.localeCompare(b.dia))

  const ventasPorCombustibleAgrupadas = (ventasPorCombustible.data || []).reduce<Record<string, { combustible: string; total_litros: number; total_ingresos: number }>>((acc, v) => {
    const key = v.tipo_combustible_id
    if (!acc[key]) {
      acc[key] = { combustible: v.tipo_combustible_id.replace('gasolina_', 'Gas. ').replace('diesel', 'Diesel'), total_litros: 0, total_ingresos: 0 }
    }
    acc[key].total_litros += Number(v.litros)
    acc[key].total_ingresos += Number(v.total)
    return acc
  }, {})

  const ventasPorCombustibleArr = Object.values(ventasPorCombustibleAgrupadas)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <VentasPorDiaChart data={ventasPorDiaArr} />
      <VentasPorCombustibleChart data={ventasPorCombustibleArr} />
      <NivelesSurtidoresChart data={surtidores.data || []} />
    </div>
  )
}

async function DashboardStats() {
  const supabase = await createClient()

  const [
    { count: surtidoresActivos },
    { count: ventasHoy },
    { count: alertasActivas },
    { count: totalProveedores },
    { count: abastecimientosMes },
    { count: turnosAbiertos },
  ] = await Promise.all([
    supabase.from('surtidores').select('*', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('ventas').select('*', { count: 'exact', head: true }).gte('fecha', new Date().toISOString().split('T')[0]),
    supabase.from('alertas').select('*', { count: 'exact', head: true }).eq('activa', true),
    supabase.from('proveedores').select('*', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('abastecimientos').select('*', { count: 'exact', head: true }).gte('fecha', new Date().toISOString().slice(0, 7)),
    supabase.from('turnos').select('*', { count: 'exact', head: true }).eq('cerrado', false),
  ])

  const stats = [
    {
      title: 'Surtidores Activos',
      value: surtidoresActivos ?? 0,
      description: 'Operativos en el sistema',
      icon: Fuel,
      gradient: 'from-blue-500/20 to-blue-600/10',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      trend: surtidoresActivos && surtidoresActivos > 0 ? 'up' : 'neutral',
    },
    {
      title: 'Ventas Hoy',
      value: ventasHoy ?? 0,
      description: 'Registradas hoy',
      icon: Receipt,
      gradient: 'from-emerald-500/20 to-emerald-600/10',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      trend: 'up',
    },
    {
      title: 'Alertas Activas',
      value: alertasActivas ?? 0,
      description: 'Niveles bajos/críticos',
      icon: AlertTriangle,
      gradient: 'from-red-500/20 to-red-600/10',
      iconBg: 'bg-red-500/10 text-red-600 dark:text-red-400',
      trend: alertasActivas && alertasActivas > 0 ? 'down' : 'neutral',
    },
    {
      title: 'Proveedores',
      value: totalProveedores ?? 0,
      description: 'Proveedores activos',
      icon: DollarSign,
      gradient: 'from-purple-500/20 to-purple-600/10',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      trend: 'neutral',
    },
    {
      title: 'Abastecimientos',
      value: abastecimientosMes ?? 0,
      description: 'Este mes',
      icon: Truck,
      gradient: 'from-amber-500/20 to-amber-600/10',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      trend: 'up',
    },
    {
      title: 'Turnos Abiertos',
      value: turnosAbiertos ?? 0,
      description: 'En curso',
      icon: Clock,
      gradient: 'from-cyan-500/20 to-cyan-600/10',
      iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      trend: turnosAbiertos && turnosAbiertos > 0 ? 'up' : 'neutral',
    },
  ]

  return (
    <div className="animate-stagger grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const TrendIcon =
          stat.trend === 'up'
            ? TrendingUp
            : stat.trend === 'down'
              ? TrendingDown
              : Minus
        const trendColor =
          stat.trend === 'up'
            ? 'text-emerald-500'
            : stat.trend === 'down'
              ? 'text-red-500'
              : 'text-muted-foreground/50'

        return (
          <Card
            key={stat.title}
            className="group relative overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            {/* Gradient background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            {/* Shimmer on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 animate-shimmer pointer-events-none" />

            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`flex size-8 items-center justify-center rounded-lg ${stat.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                <stat.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </div>
                <TrendIcon className={`size-4 ${trendColor} transition-transform duration-300 group-hover:scale-125`} />
              </div>
              <CardDescription className="mt-1">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vista general del sistema de control de surtidores.
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />
      </Suspense>

      <Suspense fallback={<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><Card className="h-[380px] animate-pulse" /><Card className="h-[380px] animate-pulse" /><Card className="h-[380px] animate-pulse" /></div>}>
        <DashboardCharts />
      </Suspense>
    </div>
  )
}
