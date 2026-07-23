import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { VentasTable } from './_components/ventas-table'
import { Receipt, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function VentasPage() {
  const supabase = await createClient()

  const { data: ventas } = await supabase
    .from('ventas')
    .select(`
      *,
      surtidores(numero),
      tipos_combustible(nombre),
      profiles!ventas_registrado_por_fkey(nombre_completo)
    `)
    .order('fecha', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Receipt className="size-6" />
            Ventas
          </h1>
          <p className="text-muted-foreground">
            Registro de transacciones de venta
          </p>
        </div>
        <a href="/ventas/nuevo">
          <Button>
            <Plus className="mr-2 size-4" />
            Nueva Venta
          </Button>
        </a>
      </div>

      <Suspense fallback={<div>Cargando ventas...</div>}>
        <VentasTable initialData={ventas ?? []} />
      </Suspense>
    </div>
  )
}
