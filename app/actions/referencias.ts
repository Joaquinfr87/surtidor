'use server'

import { createClient } from '@/utils/supabase/server'
import type { SelectOption } from '@/components/ui/search-select'

export async function getProfiles(): Promise<SelectOption[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('id, nombre_completo, email')
    .eq('activo', true)
    .order('nombre_completo')

  return (data ?? []).map((p) => ({
    value: p.id,
    label: p.nombre_completo,
    subtitle: p.email,
  }))
}

export async function getSurtidores(): Promise<SelectOption[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('surtidores')
    .select('id, numero, tipo_combustible_id, tipos_combustible(nombre)')
    .eq('activo', true)
    .order('numero')

  return (data ?? []).map((s) => ({
    value: String(s.id),
    label: `N° ${s.numero}`,
    subtitle: (s.tipos_combustible as unknown as { nombre: string } | null)?.nombre ?? '',
  }))
}

export async function getProveedores(): Promise<SelectOption[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('proveedores')
    .select('id, nombre')
    .eq('activo', true)
    .order('nombre')

  return (data ?? []).map((p) => ({
    value: String(p.id),
    label: p.nombre,
  }))
}

export async function getTiposCombustible(): Promise<SelectOption[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tipos_combustible')
    .select('id, nombre')
    .eq('activo', true)
    .order('nombre')

  return (data ?? []).map((tc) => ({
    value: tc.id,
    label: tc.nombre,
  }))
}
