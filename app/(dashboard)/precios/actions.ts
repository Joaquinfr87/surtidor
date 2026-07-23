'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import {
  createPrecioSchema,
  updatePrecioSchema,
} from '@/lib/schemas/precio'

export async function createPrecio(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const rawData = {
    tipo_combustible_id: formData.get('tipo_combustible_id'),
    precio_por_litro: formData.get('precio_por_litro'),
    fecha_inicio: formData.get('fecha_inicio'),
    fecha_fin: formData.get('fecha_fin') || null,
  }

  const parsed = createPrecioSchema.safeParse(rawData)
  if (!parsed.success) {
    const errors = JSON.stringify(parsed.error.flatten().fieldErrors)
    redirect(`/precios/nuevo?error=${encodeURIComponent(errors)}`)
  }

  const { error } = await supabase.from('precios_combustible').insert({
    ...parsed.data,
    actualizado_por: user.id,
  })

  if (error) redirect(`/precios/nuevo?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/precios')
  redirect('/precios')
}

export async function getPrecio(id: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('precios_combustible')
    .select('*, tipos_combustible(nombre)')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updatePrecio(id: number, formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    tipo_combustible_id: formData.get('tipo_combustible_id'),
    precio_por_litro: formData.get('precio_por_litro'),
    fecha_inicio: formData.get('fecha_inicio'),
    fecha_fin: formData.get('fecha_fin') || null,
  }

  const parsed = updatePrecioSchema.safeParse(rawData)
  if (!parsed.success) {
    const errors = JSON.stringify(parsed.error.flatten().fieldErrors)
    redirect(`/precios/${id}/editar?error=${encodeURIComponent(errors)}`)
  }

  const { error } = await supabase
    .from('precios_combustible')
    .update(parsed.data)
    .eq('id', id)

  if (error) redirect(`/precios/${id}/editar?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/precios')
  redirect('/precios')
}

export async function deletePrecio(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('precios_combustible').delete().eq('id', id)

  if (error) {
    console.error('Error al eliminar:', error.message)
    throw new Error(error.message)
  }

  revalidatePath('/precios')
}
