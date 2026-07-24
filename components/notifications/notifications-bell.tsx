'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSpeech } from '@/hooks/use-speech'
import { resolverAlerta } from '@/app/(dashboard)/alertas/actions'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Bell,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Fuel,
  ChevronRight,
  X,
} from 'lucide-react'

export interface AlertaData {
  id: number
  surtidor_id: number
  tipo: string
  nivel: string
  activa: boolean
  creado_en: string
  surtidores?: {
    numero: number
    tipos_combustible?: { nombre: string } | null
  } | null
}

interface Props {
  initialAlerts: AlertaData[]
}

const nivelLabels: Record<string, string> = {
  lleno: 'Lleno',
  medio: 'Medio',
  bajo: 'Bajo',
  vacio: 'Vacío',
}

const nivelColors: Record<string, string> = {
  lleno: 'text-green-500',
  medio: 'text-yellow-500',
  bajo: 'text-orange-500',
  vacio: 'text-red-500',
}

const tipoColors: Record<string, string> = {
  critico: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  bajo: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours}h`
  return `Hace ${diffDays}d`
}

function AlertVoiceReader({
  texto,
  onSpeaking,
}: {
  texto: string
  onSpeaking?: (speaking: boolean) => void
}) {
  const { speak, stop } = useSpeech()
  const [speakingState, setSpeakingState] = useState(false)

  const handleToggle = useCallback(async () => {
    if (speakingState) {
      stop()
      setSpeakingState(false)
      onSpeaking?.(false)
    } else {
      setSpeakingState(true)
      onSpeaking?.(true)
      try {
        await speak(texto, { rate: 0.9, pitch: 1 })
      } catch {
        setSpeakingState(false)
        onSpeaking?.(false)
      }
      setSpeakingState(false)
      onSpeaking?.(false)
    }
  }, [speakingState, speak, stop, texto, onSpeaking])

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'size-7 shrink-0 transition-all',
        speakingState && 'bg-primary/10 text-primary animate-pulse'
      )}
      onClick={(e) => {
        e.stopPropagation()
        handleToggle()
      }}
      title="Escuchar notificación"
    >
      <Volume2 className={cn('size-3.5', speakingState && 'animate-bounce')} />
      <span className="sr-only">Escuchar</span>
    </Button>
  )
}

export function NotificationsBell({ initialAlerts }: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [alerts, setAlerts] = useState(initialAlerts)
  const { speak } = useSpeech()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeAlerts = alerts.filter((a) => a.activa)
  const count = activeAlerts.length

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Read all active alerts aloud
  const handleReadAll = useCallback(() => {
    if (activeAlerts.length === 0) return

    const texto = activeAlerts
      .map((a) => {
        const surtidor = a.surtidores?.numero ?? 'desconocido'
        const combustible = a.surtidores?.tipos_combustible?.nombre ?? ''
        const tipo = a.tipo === 'critico' ? 'crítica' : 'baja'
        const nivel = nivelLabels[a.nivel] ?? a.nivel
        const combStr = combustible ? `Combustible: ${combustible}.` : ''
        return `Alerta ${tipo} en surtidor número ${surtidor}. ${combStr} Nivel: ${nivel}.`
      })
      .join(' ')

    const fullText = `Tienes ${activeAlerts.length} notificación${activeAlerts.length !== 1 ? 'es' : ''} activa${activeAlerts.length !== 1 ? 's' : ''}. ${texto}`
    speak(fullText, { rate: 0.9 })
  }, [activeAlerts, speak])

  const handleResolve = async (id: number) => {
    try {
      await resolverAlerta(id)
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, activa: false } : a
        )
      )
      router.refresh()
    } catch (err) {
      console.error('Error al resolver alerta:', err)
      toast.error('Error al resolver la alerta')
    }
  }

  const hasActive = activeAlerts.length > 0

  return (
    <div ref={dropdownRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'relative size-8 rounded-full transition-all',
          hasActive && 'animate-pulse-subtle'
        )}
        onClick={() => setIsOpen(!isOpen)}
        title="Notificaciones"
      >
        <Bell
          className={cn(
            'size-4 transition-all',
            hasActive ? 'text-amber-500' : 'text-muted-foreground'
          )}
          fill={hasActive ? 'currentColor' : 'none'}
        />
        {hasActive && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-red-500/40" />
            <span className="relative flex size-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold leading-none text-white">
              {count > 9 ? '9+' : count}
            </span>
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[380px] animate-in slide-in-from-top-2 fade-in-0 duration-200">
          <div className="overflow-hidden rounded-xl border bg-popover shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-amber-500" fill="currentColor" />
                <h3 className="text-sm font-semibold">Notificaciones</h3>
                {hasActive && (
                  <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                    {count} activa{count !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {hasActive && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={handleReadAll}
                    title="Leer todas"
                  >
                    <Volume2 className="size-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <Bell className="size-6 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm font-medium text-foreground/80">
                    Sin notificaciones
                  </p>
                  <p className="text-xs text-muted-foreground">
                    No hay alertas activas en este momento
                  </p>
                </div>
              ) : (
                alerts.map((alerta) => {
                  const isActive = alerta.activa
                  const nivel = alerta.nivel
                  const surtidorNum = alerta.surtidores?.numero
                  const combustible = alerta.surtidores?.tipos_combustible?.nombre ?? ''

                  const textoAlerta = [
                    `Alerta ${alerta.tipo === 'critico' ? 'crítica' : 'baja'} en surtidor número ${surtidorNum ?? 'desconocido'}.`,
                    combustible && `Combustible: ${combustible}.`,
                    `Nivel: ${nivelLabels[nivel] ?? nivel}.`,
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <div
                      key={alerta.id}
                      className={cn(
                        'group relative flex items-start gap-3 border-b px-4 py-3.5 transition-colors last:border-b-0 hover:bg-muted/50',
                        isActive && 'bg-amber-500/[0.02]'
                      )}
                    >
                      {/* Active indicator dot */}
                      {isActive && (
                        <span className="absolute left-0 top-0 h-full w-0.5 rounded-r-full bg-amber-500" />
                      )}

                      {/* Icon */}
                      <div
                        className={cn(
                          'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border',
                          isActive
                            ? alerta.tipo === 'critico'
                              ? 'border-red-500/20 bg-red-500/10'
                              : 'border-orange-500/20 bg-orange-500/10'
                            : 'border-border bg-muted'
                        )}
                      >
                        {isActive ? (
                          <AlertTriangle
                            className={cn(
                              'size-4',
                              alerta.tipo === 'critico'
                                ? 'text-red-500'
                                : 'text-orange-500'
                            )}
                          />
                        ) : (
                          <CheckCircle2 className="size-4 text-muted-foreground/50" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {isActive ? (
                                <>
                                  Surtidor{' '}
                                  <span className="font-semibold">
                                    N° {surtidorNum ?? '—'}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-muted-foreground/60 line-through">
                                    Surtidor N° {surtidorNum ?? '—'}
                                  </span>
                                  <span className="ml-2 text-xs text-muted-foreground/50">
                                    Resuelta
                                  </span>
                                </>
                              )}
                            </p>
                            {combustible && (
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                <Fuel className="size-3" />
                                {combustible}
                              </p>
                            )}
                          </div>

                          {/* Level badge */}
                          {isActive && (
                            <Badge
                              className={cn(
                                'pointer-events-none shrink-0 text-[10px] uppercase leading-none',
                                tipoColors[alerta.tipo] ?? ''
                              )}
                            >
                              <Droplets
                                className={cn('mr-1 size-2.5', nivelColors[nivel])}
                              />
                              {nivelLabels[nivel] ?? nivel}
                            </Badge>
                          )}
                        </div>

                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-[11px] text-muted-foreground/60">
                            {formatTimeAgo(alerta.creado_en)}
                          </span>
                          {alerta.tipo === 'critico' && isActive && (
                            <span className="flex items-center gap-1 text-[11px] font-medium text-red-500">
                              <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
                              Crítico
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="mt-2 flex items-center gap-1">
                          <AlertVoiceReader texto={textoAlerta} />
                          {isActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                              onClick={async (e) => {
                                e.stopPropagation()
                                await handleResolve(alerta.id)
                              }}
                            >
                              <CheckCircle2 className="mr-1 size-3" />
                              Resolver
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2.5">
              <span className="text-[11px] text-muted-foreground/60">
                {hasActive
                  ? `${activeAlerts.length} pendiente${activeAlerts.length !== 1 ? 's' : ''}`
                  : 'Todo en orden'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setIsOpen(false)
                  router.push('/alertas')
                }}
              >
                Ver todas
                <ChevronRight className="ml-1 size-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
