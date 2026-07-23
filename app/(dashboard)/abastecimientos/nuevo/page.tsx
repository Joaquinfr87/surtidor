import { AbastecimientoForm } from '../_components/abastecimiento-form'
import { getSurtidores, getProveedores, getTiposCombustible } from '@/app/actions/referencias'

export default async function NuevoAbastecimientoPage() {
  const [surtidores, proveedores, tiposCombustible] = await Promise.all([
    getSurtidores(),
    getProveedores(),
    getTiposCombustible(),
  ])

  return (
    <AbastecimientoForm
      surtidores={surtidores}
      proveedores={proveedores}
      tiposCombustible={tiposCombustible}
    />
  )
}
