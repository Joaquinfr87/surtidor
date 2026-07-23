'use client'

import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Fuel } from 'lucide-react'

interface VentasPorCombustibleProps {
  data: Array<{
    combustible: string
    total_litros: number
    total_ingresos: number
  }>
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981']

export function VentasPorCombustibleChart({ data }: VentasPorCombustibleProps) {
  const chartData = data.map((item) => ({
    name: item.combustible,
    value: Number(item.total_litros),
    ingresos: Number(item.total_ingresos),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="size-4 text-amber-500" />
          Ventas por Combustible
        </CardTitle>
        <CardDescription>Distribución de litros vendidos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value, name, props: any) => [
                  `${Number(value).toFixed(1)} L (Bs. ${props.payload.ingresos.toFixed(2)})`,
                  name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
