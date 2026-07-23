'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import {
  createSurtidorSchema,
  updateSurtidorSchema,
} from '@/lib/schemas/surtidor'

export async function createSurtidor(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const rawData = {
    numero: formData.get('numero'),
    tipo_combustible_id: formData.get('tipo_combustible_id'),
    capacidad: formData.get('capacidad'),
    activo: formData.get('activo') === 'true',
  }

  const parsed = createSurtidorSchema.safeParse(rawData)
  if (!parsed.success) {
    const errors = JSON.stringify(parsed.error.flatten().fieldErrors)
    redirect(`/surtidores/nuevo?error=${encodeURIComponent(errors)}`)
  }

  const { error } = await supabase.from('surtidores').insert({
    ...parsed.data,
    nivel_litros: parsed.data.capacidad,
    nivel: 'lleno',
    creado_por: user.id,
  })

  if (error) redirect(`/surtidores/nuevo?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/surtidores')
  redirect('/surtidores')
}

export async function getSurtidor(id: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('surtidores')
    .select('*, tipos_combustible(nombre)')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateSurtidor(id: number, formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    numero: formData.get('numero'),
    tipo_combustible_id: formData.get('tipo_combustible_id'),
    capacidad: formData.get('capacidad'),
    activo: formData.get('activo') === 'true',
  }

  const parsed = updateSurtidorSchema.safeParse(rawData)
  if (!parsed.success) {
    const errors = JSON.stringify(parsed.error.flatten().fieldErrors)
    redirect(`/surtidores/${id}/editar?error=${encodeURIComponent(errors)}`)
  }

  const { error } = await supabase
    .from('surtidores')
    .update(parsed.data)
    .eq('id', id)

  if (error) redirect(`/surtidores/${id}/editar?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/surtidores')
  redirect('/surtidores')
}

export async function deleteSurtidor(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('surtidores').delete().eq('id', id)

  if (error) {
    console.error('Error al eliminar:', error.message)
    throw new Error(error.message)
  }

  revalidatePath('/surtidores')
}
