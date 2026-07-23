import { VentaForm } from '../_components/venta-form'
import { getSurtidores, getTiposCombustible } from '@/app/actions/referencias'

export default async function NuevaVentaPage() {
  const [surtidores, tiposCombustible] = await Promise.all([
    getSurtidores(),
    getTiposCombustible(),
  ])

  return <VentaForm surtidores={surtidores} tiposCombustible={tiposCombustible} />
}
