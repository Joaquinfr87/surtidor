'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import {
  createProveedorSchema,
  updateProveedorSchema,
} from '@/lib/schemas/proveedor'

export async function createProveedor(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const rawData = {
    nombre: formData.get('nombre'),
    nit: formData.get('nit') || undefined,
    contacto: formData.get('contacto') || undefined,
    telefono: formData.get('telefono') || undefined,
    email: formData.get('email') || undefined,
    direccion: formData.get('direccion') || undefined,
    activo: formData.get('activo') !== 'false',
  }

  const parsed = createProveedorSchema.safeParse(rawData)
  if (!parsed.success) {
    const errors = JSON.stringify(parsed.error.flatten().fieldErrors)
    redirect(`/proveedores/nuevo?error=${encodeURIComponent(errors)}`)
  }

  const { error } = await supabase.from('proveedores').insert(parsed.data)

  if (error) redirect(`/proveedores/nuevo?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/proveedores')
  redirect('/proveedores')
}

export async function getProveedor(id: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('proveedores')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateProveedor(id: number, formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    nombre: formData.get('nombre'),
    nit: formData.get('nit') || undefined,
    contacto: formData.get('contacto') || undefined,
    telefono: formData.get('telefono') || undefined,
    email: formData.get('email') || undefined,
    direccion: formData.get('direccion') || undefined,
    activo: formData.get('activo') !== 'false',
  }

  const parsed = updateProveedorSchema.safeParse(rawData)
  if (!parsed.success) {
    const errors = JSON.stringify(parsed.error.flatten().fieldErrors)
    redirect(`/proveedores/${id}/editar?error=${encodeURIComponent(errors)}`)
  }

  const { error } = await supabase
    .from('proveedores')
    .update(parsed.data)
    .eq('id', id)

  if (error) redirect(`/proveedores/${id}/editar?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/proveedores')
  redirect('/proveedores')
}

export async function deleteProveedor(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('proveedores').delete().eq('id', id)

  if (error) {
    console.error('Error al eliminar:', error.message)
    throw new Error(error.message)
  }

  revalidatePath('/proveedores')
}
