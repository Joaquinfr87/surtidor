import { PrecioForm } from '../_components/precio-form'
import { getTiposCombustible } from '@/app/actions/referencias'

export default async function NuevoPrecioPage() {
  const tiposCombustible = await getTiposCombustible()

  return <PrecioForm mode="create" tiposCombustible={tiposCombustible} />
}
