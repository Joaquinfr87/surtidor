'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import {
  createTurnoSchema,
  updateTurnoSchema,
} from '@/lib/schemas/turno'

export async function createTurno(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const rawData = {
    operador_id: formData.get('operador_id'),
    supervisor_id: formData.get('supervisor_id') || null,
    inicio: formData.get('inicio'),
    notas: formData.get('notas') || undefined,
  }

  const parsed = createTurnoSchema.safeParse(rawData)
  if (!parsed.success) {
    const errors = JSON.stringify(parsed.error.flatten().fieldErrors)
    redirect(`/turnos/nuevo?error=${encodeURIComponent(errors)}`)
  }

  const { error } = await supabase.from('turnos').insert(parsed.data)

  if (error) redirect(`/turnos/nuevo?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/turnos')
  redirect('/turnos')
}

export async function getTurno(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('turnos')
    .select(`
      *,
      operador:profiles!turnos_operador_id_fkey(nombre_completo),
      supervisor:profiles!turnos_supervisor_id_fkey(nombre_completo)
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function closeTurno(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('turnos')
    .update({
      fin: new Date().toISOString(),
      cerrado: true,
    })
    .eq('id', id)

  if (error) {
    console.error('Error al cerrar turno:', error.message)
    throw new Error(error.message)
  }

  revalidatePath('/turnos')
}

export async function deleteTurno(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('turnos').delete().eq('id', id)

  if (error) {
    console.error('Error al eliminar:', error.message)
    throw new Error(error.message)
  }

  revalidatePath('/turnos')
}
