export const roleLabels: Record<string, string> = {
  admin: 'Admin',
  supervisor: 'Supervisor',
  operador: 'Operador',
  auditor: 'Auditor',
}

export const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  supervisor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  operador: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  auditor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
}

export type Permission = 'view' | 'create' | 'edit' | 'delete'

/**
 * Mapa de permisos por rol y sección.
 * Refleja las RLS policies definidas en la base de datos.
 */
export const rolePermissions: Record<string, Record<string, Permission[]>> = {
  admin: {
    dashboard: ['view'],
    surtidores: ['view', 'create', 'edit', 'delete'],
    ventas: ['view', 'create', 'edit', 'delete'],
    turnos: ['view', 'create', 'edit', 'delete'],
    alertas: ['view', 'create', 'edit', 'delete'],
    precios: ['view', 'create', 'edit', 'delete'],
    abastecimientos: ['view', 'create', 'edit', 'delete'],
    proveedores: ['view', 'create', 'edit', 'delete'],
    reportes: ['view'],
    usuarios: ['view', 'create', 'edit', 'delete'],
  },
  supervisor: {
    dashboard: ['view'],
    surtidores: ['view'],
    ventas: ['view'],
    turnos: ['view', 'create', 'edit'],
    alertas: ['view', 'create', 'edit'],
    reportes: ['view'],
  },
  operador: {
    dashboard: ['view'],
    surtidores: ['view'],
    ventas: ['view', 'create'],
    alertas: ['view'],
    turnos: ['view'],
  },
  auditor: {
    dashboard: ['view'],
    surtidores: ['view'],
    ventas: ['view'],
    alertas: ['view'],
    reportes: ['view'],
  },
}

/**
 * Verifica si un rol tiene un permiso específico para una sección.
 */
export function hasPermission(
  roles: string[],
  section: string,
  permission: Permission
): boolean {
  return roles.some((role) => {
    const perms = rolePermissions[role]?.[section]
    return perms?.includes(permission) ?? false
  })
}

/**
 * Retorna las secciones a las que un rol tiene acceso (al menos view).
 */
export function getAccessibleSections(roles: string[]): string[] {
  const sections = new Set<string>()
  for (const role of roles) {
    const permsBySection = rolePermissions[role]
    if (permsBySection) {
      for (const [section, perms] of Object.entries(permsBySection)) {
        if (perms.includes('view')) {
          sections.add(section)
        }
      }
    }
  }
  return Array.from(sections)
}
