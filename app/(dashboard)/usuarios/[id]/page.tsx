import { Suspense } from 'react'
import { getUsuario, getRoles } from '../actions'
import { UsuarioDetail } from './_components/usuario-detail'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

async function UsuarioDetailLoader({ id }: { id: string }) {
  const [profile, roles] = await Promise.all([
    getUsuario(id),
    getRoles(),
  ])

  if (!profile) notFound()

  return (
    <UsuarioDetail
      profile={{
        id: profile.id,
        email: profile.email,
        nombre_completo: profile.nombre_completo,
        telefono: profile.telefono,
        activo: profile.activo,
        creado_en: profile.creado_en,
      }}
      roles={roles}
      userRoles={profile.roles}
    />
  )
}

export default async function UsuarioDetallePage({ params }: Props) {
  const { id } = await params

  return (
    <Suspense fallback={<div>Cargando usuario...</div>}>
      <UsuarioDetailLoader id={id} />
    </Suspense>
  )
}
