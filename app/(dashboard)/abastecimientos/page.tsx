import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { AbastecimientosTable } from './_components/abastecimientos-table'
import { Truck, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AbastecimientosPage() {
  const supabase = await createClient()

  const { data: abastecimientos } = await supabase
    .from('abastecimientos')
    .select(`
      *,
      surtidores(numero),
      proveedores(nombre),
      tipos_combustible(nombre)
    `)
    .order('fecha', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Truck className="size-6" />
            Abastecimientos
          </h1>
          <p className="text-muted-foreground">
            Registro de reabastecimiento de combustible
          </p>
        </div>
        <a href="/abastecimientos/nuevo">
          <Button>
            <Plus className="mr-2 size-4" />
            Nuevo Abastecimiento
          </Button>
        </a>
      </div>

      <Suspense fallback={<div>Cargando abastecimientos...</div>}>
        <AbastecimientosTable initialData={abastecimientos ?? []} />
      </Suspense>
    </div>
  )
}
