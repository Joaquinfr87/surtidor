'use client'

import { useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { createTurnoSchema, type CreateTurnoInput } from '@/lib/schemas/turno'
import { createTurno } from '../actions'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SearchSelect, type SelectOption } from '@/components/ui/search-select'

interface Props {
  profiles: SelectOption[]
}

export function TurnoForm({ profiles }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [serverError, setServerError] = useState<string | null>(
    error ? decodeURIComponent(error) : null
  )

  const form = useForm<CreateTurnoInput>({
    resolver: zodResolver(createTurnoSchema as any) as any,
    defaultValues: {
      operador_id: '',
      supervisor_id: '',
      inicio: new Date().toISOString().slice(0, 16),
      notas: '',
    },
  })

  function onSubmit(data: CreateTurnoInput) {
    const formData = new FormData()
    formData.append('operador_id', data.operador_id)
    if (data.supervisor_id) formData.append('supervisor_id', data.supervisor_id)
    formData.append('inicio', data.inicio)
    if (data.notas) formData.append('notas', data.notas)

    startTransition(async () => {
      setServerError(null)
      await createTurno(formData)
    })
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Nuevo Turno</CardTitle>
        <CardDescription>Registra un nuevo turno de trabajo</CardDescription>
      </CardHeader>
      <CardContent>
        {serverError && (
          <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">{serverError}</div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="operador_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operador</FormLabel>
                  <FormControl>
                    <SearchSelect
                      options={profiles}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Selecciona un operador..."
                      searchPlaceholder="Buscar operador..."
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supervisor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor (opcional)</FormLabel>
                  <FormControl>
                    <SearchSelect
                      options={profiles}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      placeholder="Selecciona un supervisor..."
                      searchPlaceholder="Buscar supervisor..."
                      disabled={isPending}
                      clearable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha/Hora Inicio</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observaciones del turno" disabled={isPending} {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>{isPending ? 'Guardando...' : 'Iniciar Turno'}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
