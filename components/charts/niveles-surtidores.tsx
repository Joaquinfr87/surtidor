'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Gauge } from 'lucide-react'

interface NivelesSurtidoresProps {
  data: Array<{
    numero: number
    tipo_combustible_id: string
    capacidad: number
    nivel_litros: number
    nivel: string
  }>
}

const getNivelColor = (nivel: string) => {
  switch (nivel) {
    case 'lleno': return '#10b981'
    case 'medio': return '#f59e0b'
    case 'bajo': return '#f97316'
    case 'vacio': return '#ef4444'
    default: return '#6b7280'
  }
}

export function NivelesSurtidoresChart({ data }: NivelesSurtidoresProps) {
  const chartData = data.map((item) => ({
    name: `S${item.numero}`,
    nivel: Number(item.nivel_litros),
    capacidad: Number(item.capacidad),
    porcentaje: Math.round((Number(item.nivel_litros) / Number(item.capacidad)) * 100),
    tipo: item.tipo_combustible_id.replace('gasolina_', 'G. ').replace('diesel', 'Diesel'),
    estado: item.nivel,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="size-4 text-cyan-500" />
          Niveles de Surtidores
        </CardTitle>
        <CardDescription>Capacidad actual vs máxima</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value, name, props: any) => {
                  if (name === 'nivel') {
                    return [
                      `${Number(value).toFixed(0)} L (${props.payload.porcentaje}%) - ${props.payload.tipo}`,
                      'Nivel Actual',
                    ]
                  }
                  return [`${Number(value).toFixed(0)} L`, 'Capacidad']
                }}
              />
              <Bar dataKey="capacidad" fill="hsl(muted)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="nivel" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getNivelColor(entry.estado)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-emerald-500" />
            <span>Lleno</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-amber-500" />
            <span>Medio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-orange-500" />
            <span>Bajo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-red-500" />
            <span>Vacío</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
