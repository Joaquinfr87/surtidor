'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export interface UsuarioConRoles {
  id: string
  email: string
  nombre_completo: string
  telefono: string | null
  activo: boolean
  creado_en: string
  roles: string[]
}

export interface Rol {
  nombre: string
  descripcion: string
}

export async function getUsuarios(): Promise<UsuarioConRoles[]> {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('nombre_completo')

  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('usuario_id, rol')

  const rolesByUser: Record<string, string[]> = {}
  for (const ur of userRoles ?? []) {
    if (!rolesByUser[ur.usuario_id]) rolesByUser[ur.usuario_id] = []
    rolesByUser[ur.usuario_id].push(ur.rol)
  }

  return (profiles ?? []).map((p) => ({
    id: p.id,
    email: p.email,
    nombre_completo: p.nombre_completo,
    telefono: p.telefono,
    activo: p.activo,
    creado_en: p.creado_en,
    roles: rolesByUser[p.id] ?? [],
  }))
}

export async function getUsuario(id: string): Promise<UsuarioConRoles | null> {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) return null

  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('rol')
    .eq('usuario_id', id)

  return {
    id: profile.id,
    email: profile.email,
    nombre_completo: profile.nombre_completo,
    telefono: profile.telefono,
    activo: profile.activo,
    creado_en: profile.creado_en,
    roles: (userRoles ?? []).map((r) => r.rol),
  }
}

export async function getRoles(): Promise<Rol[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('roles')
    .select('nombre, descripcion')
    .order('nombre')

  return data ?? []
}

export async function updateUsuarioRoles(id: string, roles: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  // Verificar que el usuario actual es admin
  const { data: isAdmin } = await supabase
    .rpc('verificar_rol', { rol_requerido: 'admin' })

  if (!isAdmin) {
    throw new Error('Solo los administradores pueden cambiar roles')
  }

  // Eliminar roles existentes
  const { error: deleteError } = await supabase
    .from('user_roles')
    .delete()
    .eq('usuario_id', id)

  if (deleteError) {
    throw new Error('Error al eliminar roles: ' + deleteError.message)
  }

  // Insertar nuevos roles
  if (roles.length > 0) {
    const { error: insertError } = await supabase.from('user_roles').insert(
      roles.map((rol) => ({ usuario_id: id, rol }))
    )

    if (insertError) {
      throw new Error('Error al asignar roles: ' + insertError.message)
    }
  }

  revalidatePath('/usuarios')
  revalidatePath(`/usuarios/${id}`)
}

export async function toggleUsuarioActivo(id: string, activo: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({ activo })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/usuarios')
  revalidatePath(`/usuarios/${id}`)
}
