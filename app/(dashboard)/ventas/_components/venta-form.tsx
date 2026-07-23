'use client'

import { useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { createVentaSchema, type CreateVentaInput } from '@/lib/schemas/venta'
import { createVenta } from '../actions'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchSelect, type SelectOption } from '@/components/ui/search-select'

interface Props {
  surtidores: SelectOption[]
  tiposCombustible: SelectOption[]
}

export function VentaForm({ surtidores, tiposCombustible }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [serverError, setServerError] = useState<string | null>(
    error ? decodeURIComponent(error) : null
  )

  const form = useForm<CreateVentaInput>({
    resolver: zodResolver(createVentaSchema as any) as any,
    defaultValues: {
      surtidor_id: undefined,
      tipo_combustible_id: '',
      litros: undefined,
      notas: '',
    },
  })

  function onSubmit(data: CreateVentaInput) {
    const formData = new FormData()
    formData.append('surtidor_id', String(data.surtidor_id))
    formData.append('tipo_combustible_id', data.tipo_combustible_id)
    formData.append('litros', String(data.litros))
    if (data.notas) formData.append('notas', data.notas)

    startTransition(async () => {
      setServerError(null)
      await createVenta(formData)
    })
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Nueva Venta</CardTitle>
        <CardDescription>Registra una nueva venta de combustible</CardDescription>
      </CardHeader>
      <CardContent>
        {serverError && (
          <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">{serverError}</div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="surtidor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surtidor</FormLabel>
                  <FormControl>
                    <SearchSelect
                      options={surtidores}
                      value={field.value ? String(field.value) : ''}
                      onChange={(val) => field.onChange(val ? Number(val) : undefined)}
                      placeholder="Selecciona un surtidor..."
                      searchPlaceholder="Buscar surtidor..."
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo_combustible_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Combustible</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un combustible" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposCombustible.map((tc) => (
                        <SelectItem key={tc.value} value={tc.value}>
                          {tc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="litros"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Litros</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0" disabled={isPending} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
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
                    <Textarea placeholder="Observaciones" disabled={isPending} {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>{isPending ? 'Registrando...' : 'Registrar Venta'}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
