import { SurtidorForm } from '../_components/surtidor-form'
import { getTiposCombustible } from '@/app/actions/referencias'

export default async function NuevoSurtidorPage() {
  const tiposCombustible = await getTiposCombustible()

  return <SurtidorForm mode="create" tiposCombustible={tiposCombustible} />
}
