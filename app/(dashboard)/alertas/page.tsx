import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { AlertasTable } from './_components/alertas-table'
import { AlertTriangle } from 'lucide-react'

export default async function AlertasPage() {
  const supabase = await createClient()

  const { data: alertas } = await supabase
    .from('alertas')
    .select(`
      *,
      surtidores(numero, tipos_combustible(nombre))
    `)
    .order('creado_en', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <AlertTriangle className="size-6" />
          Alertas
        </h1>
        <p className="text-muted-foreground">
          Monitoreo de niveles de combustible
        </p>
      </div>

      <Suspense fallback={<div>Cargando alertas...</div>}>
        <AlertasTable initialData={alertas ?? []} />
      </Suspense>
    </div>
  )
}
