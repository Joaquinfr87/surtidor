'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { usePathname } from 'next/navigation'

const breadcrumbMap: Record<string, string> = {
  '/': 'Dashboard',
  '/surtidores': 'Surtidores',
  '/surtidores/nuevo': 'Nuevo Surtidor',
  '/ventas': 'Ventas',
  '/ventas/nuevo': 'Nueva Venta',
  '/turnos': 'Turnos',
  '/turnos/nuevo': 'Nuevo Turno',
  '/alertas': 'Alertas',
  '/precios': 'Precios',
  '/precios/nuevo': 'Nuevo Precio',
  '/abastecimientos': 'Abastecimientos',
  '/abastecimientos/nuevo': 'Nuevo Abastecimiento',
  '/proveedores': 'Proveedores',
  '/proveedores/nuevo': 'Nuevo Proveedor',
  '/reportes': 'Reportes',
}

export function Header() {
  const pathname = usePathname()

  // Get breadcrumb - for detail/edit pages, show parent section
  let title = breadcrumbMap[pathname]
  if (!title) {
    // Try to match dynamic routes
    const parts = pathname.split('/').filter(Boolean)
    if (parts.length >= 2) {
      const section = `/${parts[0]}`
      title = breadcrumbMap[section] ?? 'Detalle'
    } else {
      title = 'Dashboard'
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-sm px-4 transition-all">
      <SidebarTrigger className="-ml-1 size-8 rounded-full transition-colors hover:bg-accent" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-foreground/80">{title}</span>
      </div>
      <div className="flex-1" />
      <ThemeToggle />
    </header>
  )
}
