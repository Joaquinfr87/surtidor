'use client'

import { useCallback, useEffect, useRef } from 'react'

interface SpeechOptions {
  lang?: string
  rate?: number
  pitch?: number
  voice?: SpeechSynthesisVoice
}

function findSpanishVoice(): SpeechSynthesisVoice | undefined {
  if (typeof window === 'undefined') return undefined
  const voices = window.speechSynthesis.getVoices()
  // Prefer Latin American Spanish, then any Spanish, then any voice
  return (
    voices.find((v) => v.lang.startsWith('es-MX')) ??
    voices.find((v) => v.lang.startsWith('es-AR')) ??
    voices.find((v) => v.lang.startsWith('es')) ??
    undefined
  )
}

export function useSpeech() {
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null)

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
      currentUtterance.current = null
    }
  }, [])

  const speak = useCallback(
    (text: string, options?: SpeechOptions): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!('speechSynthesis' in window)) {
          reject(new Error('SpeechSynthesis not supported'))
          return
        }

        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = options?.lang ?? 'es'
        utterance.rate = options?.rate ?? 1
        utterance.pitch = options?.pitch ?? 1
        utterance.voice = options?.voice ?? findSpanishVoice() ?? null

        utterance.onend = () => {
          currentUtterance.current = null
          resolve()
        }

        utterance.onerror = (event) => {
          currentUtterance.current = null
          reject(new Error(`SpeechSynthesis error: ${event.error}`))
        }

        currentUtterance.current = utterance
        window.speechSynthesis.speak(utterance)
      })
    },
    []
  )

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    currentUtterance.current = null
  }, [])

  const isSpeaking = useCallback(() => {
    return window.speechSynthesis?.speaking ?? false
  }, [])

  return { speak, stop, isSpeaking }
}
