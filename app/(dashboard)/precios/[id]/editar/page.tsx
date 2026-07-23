import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { PrecioForm } from '../../_components/precio-form'
import { getTiposCombustible } from '@/app/actions/referencias'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarPrecioPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [precioResult, tiposCombustible] = await Promise.all([
    supabase.from('precios_combustible').select('*').eq('id', Number(id)).single(),
    getTiposCombustible(),
  ])

  const { data: precio } = precioResult

  if (!precio) notFound()

  return (
    <PrecioForm
      mode="edit"
      initialData={{
        tipo_combustible_id: precio.tipo_combustible_id,
        precio_por_litro: precio.precio_por_litro,
        fecha_inicio: precio.fecha_inicio,
        fecha_fin: precio.fecha_fin,
      }}
      id={precio.id}
      tiposCombustible={tiposCombustible}
    />
  )
}
