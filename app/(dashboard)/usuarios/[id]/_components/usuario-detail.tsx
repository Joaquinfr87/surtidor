'use client'

import { useTransition, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Mail, User, Phone, Calendar, Power, Shield, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { roleLabels, roleColors } from '@/lib/constants/roles'
import { updateUsuarioRoles, toggleUsuarioActivo } from '../../actions'

interface Profile {
  id: string
  email: string
  nombre_completo: string
  telefono: string | null
  activo: boolean
  creado_en: string
}

interface Role {
  nombre: string
  descripcion: string
}

interface Props {
  profile: Profile
  roles: Role[]
  userRoles: string[]
}

export function UsuarioDetail({ profile, roles, userRoles }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [selectedRoles, setSelectedRoles] = useState<string[]>(userRoles)
  const message = searchParams.get('message')
  const error = searchParams.get('error')

  const hasChanges =
    selectedRoles.length !== userRoles.length ||
    !selectedRoles.every((r) => userRoles.includes(r))

  function handleToggleRole(role: string) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  function handleSaveRoles() {
    startTransition(async () => {
      try {
        await updateUsuarioRoles(profile.id, selectedRoles)
        toast.success('Roles actualizados correctamente')
        router.refresh()
      } catch {
        toast.error('Error al actualizar los roles')
      }
    })
  }

  function handleToggleActive() {
    startTransition(async () => {
      try {
        await toggleUsuarioActivo(profile.id, !profile.activo)
        router.refresh()
        toast.success(profile.activo ? 'Usuario desactivado' : 'Usuario activado')
      } catch {
        toast.error('Error al cambiar estado')
      }
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/usuarios">
            <Button variant="ghost" size="icon" className="size-8 rounded-full">
              <ArrowLeft className="size-4" />
            </Button>
          </a>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <User className="size-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{profile.nombre_completo}</h1>
          </div>
        </div>
        <Button
          variant={profile.activo ? 'outline' : 'default'}
          size="sm"
          onClick={handleToggleActive}
          disabled={isPending}
        >
          <Power className="mr-2 size-4" />
          {profile.activo ? 'Desactivar' : 'Activar'}
        </Button>
      </div>

      {message && (
        <div className="rounded-md bg-primary/15 p-3 text-sm text-primary animate-fade-in">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive animate-fade-in">
          {error}
        </div>
      )}

      {/* Profile Info */}
      <div className="animate-stagger grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Email</CardTitle>
            <Mail className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{profile.email}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Teléfono</CardTitle>
            <Phone className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{profile.telefono ?? '—'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estado</CardTitle>
            <Power className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={profile.activo ? 'default' : 'secondary'}>
              {profile.activo ? 'Activo' : 'Inactivo'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Registrado</CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {new Date(profile.creado_en).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Management */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            Asignación de Roles
          </CardTitle>
          <CardDescription>
            Selecciona los roles que tendrá este usuario en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {roles.map((role) => {
              const isSelected = selectedRoles.includes(role.nombre)
              return (
                <button
                  key={role.nombre}
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggleRole(role.nombre)}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all',
                    isSelected
                      ? 'border-primary/30 bg-primary/5 shadow-sm'
                      : 'border-border hover:border-muted-foreground/30 hover:bg-muted/50'
                  )}
                >
                  {/* Checkbox indicator */}
                  <div
                    className={cn(
                      'flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/30'
                    )}
                  >
                    {isSelected && <Check className="size-3" />}
                  </div>

                  {/* Role info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={cn('px-2 py-0.5 text-xs', roleColors[role.nombre] ?? '')}>
                        {roleLabels[role.nombre] ?? role.nombre}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{role.descripcion}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Roles seleccionados: <strong>{selectedRoles.length}</strong>
            </p>
            <Button onClick={handleSaveRoles} disabled={!hasChanges || isPending}>
              {isPending ? 'Guardando...' : 'Guardar Roles'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
