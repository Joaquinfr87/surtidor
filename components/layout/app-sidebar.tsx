'use client'

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

const navItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Surtidores', url: '/surtidores', icon: Fuel },
  { title: 'Ventas', url: '/ventas', icon: Receipt },
  { title: 'Turnos', url: '/turnos', icon: Clock },
  { title: 'Alertas', url: '/alertas', icon: AlertTriangle },
  { title: 'Precios', url: '/precios', icon: DollarSign },
  { title: 'Abastecimientos', url: '/abastecimientos', icon: Truck },
  { title: 'Proveedores', url: '/proveedores', icon: Factory },
  { title: 'Reportes', url: '/reportes', icon: BarChart3 },
  { title: 'Usuarios', url: '/usuarios', icon: Users },
]

interface AppSidebarProps {
  user: {
    email: string
    nombre_completo: string
  }
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile } = useSidebar()

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
                      <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
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
