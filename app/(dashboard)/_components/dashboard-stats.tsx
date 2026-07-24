'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { DashboardResumenVoz } from './resumen-voz'

interface Props {
  surtidoresActivos: number
  ventasHoy: number
  alertasActivas: number
  totalProveedores: number
  abastecimientosMes: number
  turnosAbiertos: number
}

export function DashboardStatsClient({
  surtidoresActivos,
  ventasHoy,
  alertasActivas,
  totalProveedores,
  abastecimientosMes,
  turnosAbiertos,
}: Props) {
  const stats = [
    {
      title: 'Surtidores Activos',
      value: surtidoresActivos,
      description: 'Operativos en el sistema',
      icon: Fuel,
      gradient: 'from-blue-500/20 to-blue-600/10',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      trend: surtidoresActivos > 0 ? 'up' : 'neutral',
    },
    {
      title: 'Ventas Hoy',
      value: ventasHoy,
      description: 'Registradas hoy',
      icon: Receipt,
      gradient: 'from-emerald-500/20 to-emerald-600/10',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      trend: 'up',
    },
    {
      title: 'Alertas Activas',
      value: alertasActivas,
      description: 'Niveles bajos/críticos',
      icon: AlertTriangle,
      gradient: 'from-red-500/20 to-red-600/10',
      iconBg: 'bg-red-500/10 text-red-600 dark:text-red-400',
      trend: alertasActivas > 0 ? 'down' : 'neutral',
    },
    {
      title: 'Proveedores',
      value: totalProveedores,
      description: 'Proveedores activos',
      icon: DollarSign,
      gradient: 'from-purple-500/20 to-purple-600/10',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      trend: 'neutral',
    },
    {
      title: 'Abastecimientos',
      value: abastecimientosMes,
      description: 'Este mes',
      icon: Truck,
      gradient: 'from-amber-500/20 to-amber-600/10',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      trend: 'up',
    },
    {
      title: 'Turnos Abiertos',
      value: turnosAbiertos,
      description: 'En curso',
      icon: Clock,
      gradient: 'from-cyan-500/20 to-cyan-600/10',
      iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      trend: turnosAbiertos > 0 ? 'up' : 'neutral',
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
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />
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
      <div className="col-span-full flex justify-end">
        <DashboardResumenVoz
          ventasHoy={ventasHoy}
          alertasActivas={alertasActivas}
          surtidoresActivos={surtidoresActivos}
          abastecimientosMes={abastecimientosMes}
        />
      </div>
    </div>
  )
}
