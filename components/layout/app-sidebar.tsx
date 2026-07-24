'use client'

'use client'

import { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Fuel,
  Receipt,
  AlertTriangle,
  BarChart3,
  LogOut,
  Factory,
  DollarSign,
  Truck,
  Clock,
  Users,
  Shield,
} from 'lucide-react'

import { Logo } from '@/components/ui/logo'
import { signOut } from '@/app/(auth)/logout/actions'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { roleLabels, roleColors, getAccessibleSections } from '@/lib/constants/roles'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  section: string
}

const allNavItems: NavItem[] = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard, section: 'dashboard' },
  { title: 'Surtidores', url: '/surtidores', icon: Fuel, section: 'surtidores' },
  { title: 'Ventas', url: '/ventas', icon: Receipt, section: 'ventas' },
  { title: 'Turnos', url: '/turnos', icon: Clock, section: 'turnos' },
  { title: 'Alertas', url: '/alertas', icon: AlertTriangle, section: 'alertas' },
  { title: 'Precios', url: '/precios', icon: DollarSign, section: 'precios' },
  { title: 'Abastecimientos', url: '/abastecimientos', icon: Truck, section: 'abastecimientos' },
  { title: 'Proveedores', url: '/proveedores', icon: Factory, section: 'proveedores' },
  { title: 'Reportes', url: '/reportes', icon: BarChart3, section: 'reportes' },
  { title: 'Usuarios', url: '/usuarios', icon: Users, section: 'usuarios' },
]

interface AppSidebarProps {
  user: {
    email: string
    nombre_completo: string
    roles: string[]
  }
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile } = useSidebar()

  // Filter nav items based on user's roles
  const accessibleSections = useMemo(
    () => getAccessibleSections(user.roles),
    [user.roles]
  )

  const navItems = useMemo(
    () => allNavItems.filter((item) => accessibleSections.includes(item.section)),
    [accessibleSections]
  )

  // Get primary role for display (first role)
  const primaryRole = user.roles[0] ?? ''
  const roleLabel = roleLabels[primaryRole] ?? ''
  const roleBadgeColor = roleColors[primaryRole] ?? ''

  const initials = user.nombre_completo
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-center">
              <Logo size="md" showText />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.url || (item.url !== '/' && pathname.startsWith(item.url))}
                    onClick={() => router.push(item.url)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg" className="group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-center">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.nombre_completo}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Shield className="size-3 text-muted-foreground" />
                        {roleLabel && (
                          <Badge
                            variant="secondary"
                            className={`px-1.5 py-0 text-[10px] font-medium leading-none ${roleBadgeColor}`}
                          >
                            {roleLabel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                side={isMobile ? 'top' : 'right'}
                align="start"
                className="w-56"
              >
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
