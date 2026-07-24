import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { DashboardSkeleton } from '@/components/ui/page-skeleton'
import { VentasPorDiaChart } from '@/components/charts/ventas-por-dia'
import { VentasPorCombustibleChart } from '@/components/charts/ventas-por-combustible'
import { NivelesSurtidoresChart } from '@/components/charts/niveles-surtidores'
import { DashboardStatsClient } from './_components/dashboard-stats'
import { Card } from '@/components/ui/card'

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

  return (
    <DashboardStatsClient
      surtidoresActivos={surtidoresActivos ?? 0}
      ventasHoy={ventasHoy ?? 0}
      alertasActivas={alertasActivas ?? 0}
      totalProveedores={totalProveedores ?? 0}
      abastecimientosMes={abastecimientosMes ?? 0}
      turnosAbiertos={turnosAbiertos ?? 0}
    />
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Vista general del sistema de control de surtidores.
          </p>
        </div>
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
