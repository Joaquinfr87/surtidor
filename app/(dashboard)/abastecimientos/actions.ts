'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import {
  createAbastecimientoSchema,
} from '@/lib/schemas/abastecimiento'

export async function createAbastecimiento(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const rawData = {
    surtidor_id: formData.get('surtidor_id'),
    proveedor_id: formData.get('proveedor_id'),
    tipo_combustible_id: formData.get('tipo_combustible_id'),
    litros: formData.get('litros'),
    precio_por_litro: formData.get('precio_por_litro'),
    costo_total: formData.get('costo_total'),
    factura: formData.get('factura') || undefined,
  }

  const parsed = createAbastecimientoSchema.safeParse(rawData)
  if (!parsed.success) {
    const errors = JSON.stringify(parsed.error.flatten().fieldErrors)
    redirect(`/abastecimientos/nuevo?error=${encodeURIComponent(errors)}`)
  }

  const { error } = await supabase.from('abastecimientos').insert({
    ...parsed.data,
    registrado_por: user.id,
  })

  if (error) redirect(`/abastecimientos/nuevo?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/abastecimientos')
  redirect('/abastecimientos')
}

export async function getAbastecimiento(id: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('abastecimientos')
    .select(`
      *,
      surtidores(numero),
      proveedores(nombre),
      tipos_combustible(nombre)
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteAbastecimiento(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('abastecimientos').delete().eq('id', id)

  if (error) {
    console.error('Error al eliminar:', error.message)
    throw new Error(error.message)
  }

  revalidatePath('/abastecimientos')
}
