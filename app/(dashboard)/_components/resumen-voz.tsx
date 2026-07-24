'use client'

import { useSpeech } from '@/hooks/use-speech'
import { Button } from '@/components/ui/button'
import { Volume2 } from 'lucide-react'

interface Props {
  ventasHoy: number
  alertasActivas: number
  surtidoresActivos: number
  abastecimientosMes: number
}

export function DashboardResumenVoz({ ventasHoy, alertasActivas, surtidoresActivos, abastecimientosMes }: Props) {
  const { speak } = useSpeech()

  const generarResumen = () => {
    const partes: string[] = []

    partes.push(`Bienvenido al sistema de control de surtidor.`)
    partes.push(`Hoy se registraron ${ventasHoy} venta${ventasHoy !== 1 ? 's' : ''}.`)

    if (alertasActivas > 0) {
      partes.push(`Hay ${alertasActivas} alerta${alertasActivas !== 1 ? 's' : ''} activa${alertasActivas !== 1 ? 's' : ''}.`)
    } else {
      partes.push(`No hay alertas activas.`)
    }

    partes.push(`${surtidoresActivos} surtidor${surtidoresActivos !== 1 ? 'es' : ''} operativo${surtidoresActivos !== 1 ? 's' : ''}.`)
    partes.push(`${abastecimientosMes} abastecimiento${abastecimientosMes !== 1 ? 's' : ''} este mes.`)

    speak(partes.join(' '))
  }

  return (
    <Button variant="outline" size="sm" onClick={generarResumen}>
      <Volume2 className="mr-2 size-4" />
      Resumen de voz
    </Button>
  )
}
