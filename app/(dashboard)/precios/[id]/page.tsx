import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, ArrowLeft, Fuel, DollarSign, Calendar, Clock } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PrecioDetallePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: precio } = await supabase
    .from('precios_combustible')
    .select('*, tipos_combustible(nombre)')
    .eq('id', Number(id))
    .single()

  if (!precio) notFound()

  const detailItems = [
    {
      label: 'Combustible',
      value: precio.tipos_combustible?.nombre ?? '—',
      icon: Fuel,
    },
    {
      label: 'Precio por Litro',
      value: `Bs. ${(precio.precio_por_litro ?? 0).toFixed(2)}`,
      icon: DollarSign,
      highlight: true,
    },
    {
      label: 'Fecha Inicio',
      value: new Date(precio.fecha_inicio).toLocaleDateString(),
      icon: Calendar,
    },
    {
      label: 'Fecha Fin',
      value: precio.fecha_fin
        ? new Date(precio.fecha_fin).toLocaleDateString()
        : 'Vigente',
      icon: Clock,
      badge: !precio.fecha_fin,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/precios">
            <Button variant="ghost" size="icon" className="size-8 rounded-full">
              <ArrowLeft className="size-4" />
            </Button>
          </a>
          <h1 className="text-2xl font-bold tracking-tight">Detalle de Precio</h1>
        </div>
        <a href={`/precios/${id}/editar`}>
          <Button>
            <Pencil className="mr-2 size-4" />
            Editar
          </Button>
        </a>
      </div>

      <div className="animate-stagger grid gap-4 md:grid-cols-2">
        {detailItems.map((item) => (
          <Card key={item.label} className={item.highlight ? 'border-primary/30 bg-primary/5' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
              <item.icon className={`size-4 ${item.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className={`${item.highlight ? 'text-2xl' : 'text-xl'} font-bold`}>
                {item.badge ? (
                  <Badge variant="outline">{item.value}</Badge>
                ) : (
                  item.value
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
