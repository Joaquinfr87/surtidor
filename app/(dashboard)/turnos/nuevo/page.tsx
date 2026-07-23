import { TurnoForm } from '../_components/turno-form'
import { getProfiles } from '@/app/actions/referencias'

export default async function NuevoTurnoPage() {
  const profiles = await getProfiles()

  return <TurnoForm profiles={profiles} />
}
