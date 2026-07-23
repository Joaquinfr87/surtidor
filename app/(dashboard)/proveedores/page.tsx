import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { ProveedoresTable } from './_components/proveedores-table'
import { Factory, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function ProveedoresPage() {
  const supabase = await createClient()

  const { data: proveedores } = await supabase
    .from('proveedores')
    .select('*')
    .order('nombre', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Factory className="size-6" />
            Proveedores
          </h1>
          <p className="text-muted-foreground">
            Gestión de proveedores de combustible
          </p>
        </div>
        <a href="/proveedores/nuevo">
          <Button>
            <Plus className="mr-2 size-4" />
            Nuevo Proveedor
          </Button>
        </a>
      </div>

      <Suspense fallback={<div>Cargando proveedores...</div>}>
        <ProveedoresTable initialData={proveedores ?? []} />
      </Suspense>
    </div>
  )
}
