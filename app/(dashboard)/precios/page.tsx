import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { PreciosTable } from './_components/precios-table'
import { DollarSign, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function PreciosPage() {
  const supabase = await createClient()

  const { data: precios } = await supabase
    .from('precios_combustible')
    .select('*, tipos_combustible(nombre)')
    .order('fecha_inicio', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <DollarSign className="size-6" />
            Precios de Combustible
          </h1>
          <p className="text-muted-foreground">
            Historial de precios por tipo de combustible
          </p>
        </div>
        <a href="/precios/nuevo">
          <Button>
            <Plus className="mr-2 size-4" />
            Nuevo Precio
          </Button>
        </a>
      </div>

      <Suspense fallback={<div>Cargando precios...</div>}>
        <PreciosTable initialData={precios ?? []} />
      </Suspense>
    </div>
  )
}
