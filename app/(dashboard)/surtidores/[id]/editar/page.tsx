import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { SurtidorForm } from '../../_components/surtidor-form'
import { getTiposCombustible } from '@/app/actions/referencias'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarSurtidorPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [surtidorResult, tiposCombustible] = await Promise.all([
    supabase.from('surtidores').select('*').eq('id', Number(id)).single(),
    getTiposCombustible(),
  ])

  const { data: surtidor } = surtidorResult

  if (!surtidor) notFound()

  return (
    <SurtidorForm
      mode="edit"
      initialData={surtidor}
      id={surtidor.id}
      tiposCombustible={tiposCombustible}
    />
  )
}
