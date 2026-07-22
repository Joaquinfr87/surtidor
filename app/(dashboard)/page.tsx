import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Fuel, Receipt, AlertTriangle, BarChart3 } from 'lucide-react'

const stats = [
  {
    title: 'Surtidores',
    value: '—',
    description: 'Activos en el sistema',
    icon: Fuel,
  },
  {
    title: 'Ventas Hoy',
    value: '—',
    description: 'Registradas hoy',
    icon: Receipt,
  },
  {
    title: 'Alertas',
    value: '—',
    description: 'Alertas activas',
    icon: AlertTriangle,
  },
  {
    title: 'Reportes',
    value: '—',
    description: 'Generados este mes',
    icon: BarChart3,
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vista general del sistema de control de surtidores.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <CardDescription>{stat.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
