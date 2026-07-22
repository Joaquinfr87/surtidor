'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        nombre_completo: formData.get('nombre_completo') as string,
      },
    },
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/register?error=' + encodeURIComponent(error.message))
  }

  redirect(
    '/login?message=' +
      encodeURIComponent('Cuenta creada. Revisa tu email para confirmar.')
  )
}
