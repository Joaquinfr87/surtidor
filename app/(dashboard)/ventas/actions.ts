'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createVentaSchema } from '@/lib/schemas/venta'

export async function createVenta(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const rawData = {
    surtidor_id: formData.get('surtidor_id'),
    tipo_combustible_id: formData.get('tipo_combustible_id'),
    litros: formData.get('litros'),
    notas: formData.get('notas') || undefined,
  }

  const parsed = createVentaSchema.safeParse(rawData)
  if (!parsed.success) {
    const errors = JSON.stringify(parsed.error.flatten().fieldErrors)
    redirect(`/ventas/nuevo?error=${encodeURIComponent(errors)}`)
  }

  // Obtener precio vigente
  const { data: precio } = await supabase
    .from('precios_combustible')
    .select('precio_por_litro')
    .eq('tipo_combustible_id', parsed.data.tipo_combustible_id)
    .lte('fecha_inicio', new Date().toISOString().split('T')[0])
    .or('fecha_fin.is.null,fecha_fin.gte.' + new Date().toISOString().split('T')[0])
    .order('fecha_inicio', { ascending: false })
    .limit(1)
    .single()

  if (!precio) {
    redirect(`/ventas/nuevo?error=${encodeURIComponent('No hay precio vigente para este combustible')}`)
  }

  const subtotal = parsed.data.litros * precio.precio_por_litro
  const impuesto = subtotal * 0.13
  const total = subtotal + impuesto

  const { error } = await supabase.from('ventas').insert({
    surtidor_id: parsed.data.surtidor_id,
    tipo_combustible_id: parsed.data.tipo_combustible_id,
    litros: parsed.data.litros,
    precio_unitario: precio.precio_por_litro,
    subtotal,
    impuesto,
    total,
    registrado_por: user.id,
    notas: parsed.data.notas,
  })

  if (error) redirect(`/ventas/nuevo?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/ventas')
  redirect('/ventas')
}

export async function getVenta(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ventas')
    .select(`
      *,
      surtidores(numero),
      tipos_combustible(nombre),
      profiles!ventas_registrado_por_fkey(nombre_completo),
      pagos(*, metodos_pago(nombre))
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function anularVenta(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('ventas')
    .update({ anulada: true })
    .eq('id', id)

  if (error) {
    console.error('Error al anular:', error.message)
    throw new Error(error.message)
  }

  revalidatePath('/ventas')
}
