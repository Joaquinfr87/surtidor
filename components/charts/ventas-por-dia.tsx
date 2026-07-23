'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface VentasPorDiaProps {
  data: Array<{
    dia: string
    total_ventas: number
    total_litros: number
    total_ingresos: number
  }>
}

export function VentasPorDiaChart({ data }: VentasPorDiaProps) {
  const chartData = data.map((item) => ({
    dia: new Date(item.dia).toLocaleDateString('es-BO', { weekday: 'short', day: 'numeric' }),
    ingresos: Number(item.total_ingresos),
    litros: Number(item.total_litros),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="size-4 text-emerald-500" />
          Ventas por Día
        </CardTitle>
        <CardDescription>Ingresos de los últimos 7 días</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="dia" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value, name) => [
                  name === 'ingresos' ? `Bs. ${Number(value).toFixed(2)}` : `${Number(value).toFixed(1)} L`,
                  name === 'ingresos' ? 'Ingresos' : 'Litros',
                ]}
              />
              <Bar 
                dataKey="ingresos" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                name="ingresos"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
