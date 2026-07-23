import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { SurtidoresTable } from './_components/surtidores-table'
import { Fuel, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function SurtidoresPage() {
  const supabase = await createClient()

  const { data: surtidores } = await supabase
    .from('surtidores')
    .select(`
      *,
      tipos_combustible (
        nombre
      )
    `)
    .order('numero', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Fuel className="size-6" />
            Surtidores
          </h1>
          <p className="text-muted-foreground">
            Gestión de surtidores de combustible
          </p>
        </div>
        <a href="/surtidores/nuevo">
          <Button>
            <Plus className="mr-2 size-4" />
            Nuevo Surtidor
          </Button>
        </a>
      </div>

      <Suspense fallback={<div>Cargando surtidores...</div>}>
        <SurtidoresTable initialData={surtidores ?? []} />
      </Suspense>
    </div>
  )
}
