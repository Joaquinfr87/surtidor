'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function resolverAlerta(id: number) {
  const supabase = await createClient()

  // Obtener usuario autenticado desde el servidor
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  const { error } = await supabase
    .from('alertas')
    .update({
      activa: false,
      resuelto_por: user.id,
      resuelta_en: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error al resolver alerta:', error.message)
    throw new Error(error.message)
  }

  revalidatePath('/alertas')
}
