import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Fuel, DollarSign, Receipt, User, Calculator, Percent, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  params: Promise<{ id: string }>
}

export default async function VentaDetallePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: venta } = await supabase
    .from('ventas')
    .select(`
      *,
      surtidores(numero),
      tipos_combustible(nombre),
      profiles!ventas_registrado_por_fkey(nombre_completo),
      pagos(*, metodos_pago(nombre))
    `)
    .eq('id', id)
    .single()

  if (!venta) notFound()

  const detailItems = [
    { label: 'Surtidor', value: `N° ${venta.surtidores?.numero ?? '—'}`, icon: Fuel },
    { label: 'Combustible', value: venta.tipos_combustible?.nombre ?? '—', icon: Fuel },
    { label: 'Litros', value: `${venta.litros} L`, icon: Calculator },
    { label: 'Precio Unitario', value: `Bs. ${venta.precio_unitario}`, icon: DollarSign },
    { label: 'Subtotal', value: `Bs. ${venta.subtotal}`, icon: Calculator },
    { label: 'Impuesto (13%)', value: `Bs. ${venta.impuesto}`, icon: Percent },
    { label: 'Total', value: `Bs. ${venta.total}`, icon: DollarSign, highlight: true },
    { label: 'Registrado por', value: venta.profiles?.nombre_completo ?? '—', icon: User },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/ventas">
            <Button variant="ghost" size="icon" className="size-8 rounded-full">
              <ArrowLeft className="size-4" />
            </Button>
          </a>
          <h1 className="text-2xl font-bold tracking-tight">Detalle de Venta</h1>
        </div>
        <Badge
          variant={venta.anulada ? 'destructive' : 'default'}
          className="px-3 py-1 text-sm transition-all"
        >
          {venta.anulada ? 'Anulada' : 'Vigente'}
        </Badge>
      </div>

      <div className="animate-stagger grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {detailItems.map((item) => (
          <Card key={item.label} className={item.highlight ? 'border-primary/30 bg-primary/5' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
              <item.icon className={`size-4 ${item.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className={`${item.highlight ? 'text-2xl' : 'text-xl'} font-bold`}>{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {venta.pagos && venta.pagos.length > 0 && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="size-5" />
              Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {venta.pagos.map((pago: { id: string; monto: number; metodo_pago?: { nombre: string } | null; referencia: string | null }) => (
                <div key={pago.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <DollarSign className="size-4 text-muted-foreground" />
                    <span className="font-medium">{pago.metodo_pago?.nombre ?? '—'}</span>
                    {pago.referencia && (
                      <span className="text-sm text-muted-foreground">Ref: {pago.referencia}</span>
                    )}
                  </div>
                  <span className="font-mono font-medium">Bs. {pago.monto}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {venta.notas && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="size-5" />
              Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{venta.notas}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
