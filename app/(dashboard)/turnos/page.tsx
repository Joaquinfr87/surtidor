import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { TurnosTable } from './_components/turnos-table'
import { Clock, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function TurnosPage() {
  const supabase = await createClient()

  const { data: turnos } = await supabase
    .from('turnos')
    .select(`
      *,
      operador:profiles!turnos_operador_id_fkey(nombre_completo),
      supervisor:profiles!turnos_supervisor_id_fkey(nombre_completo)
    `)
    .order('inicio', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Clock className="size-6" />
            Turnos
          </h1>
          <p className="text-muted-foreground">
            Gestión de turnos de trabajo
          </p>
        </div>
        <a href="/turnos/nuevo">
          <Button>
            <Plus className="mr-2 size-4" />
            Nuevo Turno
          </Button>
        </a>
      </div>

      <Suspense fallback={<div>Cargando turnos...</div>}>
        <TurnosTable initialData={turnos ?? []} />
      </Suspense>
    </div>
  )
}
