import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { createClient } from '@/utils/supabase/server'

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

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <Header />
        <div className="flex-1 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
