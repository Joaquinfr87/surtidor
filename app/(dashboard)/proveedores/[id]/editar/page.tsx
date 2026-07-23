import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ProveedorForm } from '../../_components/proveedor-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarProveedorPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: proveedor } = await supabase
    .from('proveedores')
    .select('*')
    .eq('id', Number(id))
    .single()

  if (!proveedor) notFound()

  return <ProveedorForm mode="edit" initialData={proveedor} id={proveedor.id} />
}
