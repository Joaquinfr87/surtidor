import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { createClient } from '@/utils/supabase/server'
import type { AlertaData } from '@/components/notifications/notifications-bell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  // Fetch user roles from the user_roles table
  const userId = data?.claims?.sub
  let roles: string[] = []
  if (userId) {
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('rol')
      .eq('usuario_id', userId)
    roles = userRoles?.map((ur) => ur.rol) ?? []
  }

  const user = data?.claims
    ? {
        email: data.claims.email ?? '',
        nombre_completo:
          data.claims.user_metadata?.nombre_completo ?? 'Usuario',
        roles,
      }
    : { email: '', nombre_completo: 'Usuario', roles: [] }

  // Fetch active alerts for notifications
  const { data: alertas } = await supabase
    .from('alertas')
    .select(`
      id,
      surtidor_id,
      tipo,
      nivel,
      activa,
      creado_en,
      surtidores (
        numero,
        tipos_combustible (
          nombre
        )
      )
    `)
    .eq('activa', true)
    .order('creado_en', { ascending: false })
    .limit(20)

  // Also fetch recently resolved alerts for context
  const { data: resueltas } = await supabase
    .from('alertas')
    .select(`
      id,
      surtidor_id,
      tipo,
      nivel,
      activa,
      creado_en,
      surtidores (
        numero,
        tipos_combustible (
          nombre
        )
      )
    `)
    .eq('activa', false)
    .order('creado_en', { ascending: false })
    .limit(5)

  // Combine active + recently resolved, active first.
  // Cast to AlertaData[] since Supabase's inferred types don't reflect FK cardinality.
  const allAlerts = [...(alertas ?? []), ...(resueltas ?? [])] as unknown as AlertaData[]

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <Header activeAlerts={allAlerts} />
        <div className="flex-1 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
