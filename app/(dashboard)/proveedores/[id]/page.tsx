import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, ArrowLeft, Building2, Hash, User, Phone, Mail, MapPin, Power } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProveedorDetallePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: proveedor } = await supabase
    .from('proveedores')
    .select('*')
    .eq('id', Number(id))
    .single()

  if (!proveedor) notFound()

  const detailItems = [
    { label: 'NIT', value: proveedor.nit ?? '—', icon: Hash },
    { label: 'Contacto', value: proveedor.contacto ?? '—', icon: User },
    { label: 'Teléfono', value: proveedor.telefono ?? '—', icon: Phone },
    { label: 'Email', value: proveedor.email ?? '—', icon: Mail },
    { label: 'Dirección', value: proveedor.direccion ?? '—', icon: MapPin },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/proveedores">
            <Button variant="ghost" size="icon" className="size-8 rounded-full">
              <ArrowLeft className="size-4" />
            </Button>
          </a>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="size-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{proveedor.nombre}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={proveedor.activo ? 'default' : 'secondary'} className="px-3 py-1">
            {proveedor.activo ? 'Activo' : 'Inactivo'}
          </Badge>
          <a href={`/proveedores/${id}/editar`}>
            <Button>
              <Pencil className="mr-2 size-4" />
              Editar
            </Button>
          </a>
        </div>
      </div>

      <div className="animate-stagger grid gap-4 md:grid-cols-2">
        {detailItems.map((item) => (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
              <item.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
