import { Suspense } from 'react'
import { getUsuarios } from './actions'
import { UsuariosTable } from './_components/usuarios-table'
import { Users } from 'lucide-react'

async function UsuariosList() {
  const usuarios = await getUsuarios()
  return <UsuariosTable initialData={usuarios} />
}

export default function UsuariosPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Users className="size-6" />
            Usuarios
          </h1>
          <p className="text-muted-foreground">
            Gestión de usuarios y asignación de roles
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Cargando usuarios...</div>}>
        <UsuariosList />
      </Suspense>
    </div>
  )
}
