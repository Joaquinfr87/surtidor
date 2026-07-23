'use client'

import { useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  createSurtidorSchema,
  type CreateSurtidorInput,
} from '@/lib/schemas/surtidor'
import { createSurtidor, updateSurtidor } from '../actions'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import type { SelectOption } from '@/components/ui/search-select'

interface Props {
  mode: 'create' | 'edit'
  initialData?: Partial<CreateSurtidorInput>
  id?: number
  tiposCombustible: SelectOption[]
}

export function SurtidorForm({ mode, initialData, id, tiposCombustible }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [serverError, setServerError] = useState<string | null>(
    error ? decodeURIComponent(error) : null
  )

  const form = useForm<CreateSurtidorInput>({
    resolver: zodResolver(createSurtidorSchema as any) as any,
    defaultValues: {
      numero: initialData?.numero ?? undefined,
      tipo_combustible_id: initialData?.tipo_combustible_id ?? '',
      capacidad: initialData?.capacidad ?? undefined,
      activo: initialData?.activo ?? true,
    },
  })

  function onSubmit(data: CreateSurtidorInput) {
    const formData = new FormData()
    formData.append('numero', String(data.numero))
    formData.append('tipo_combustible_id', data.tipo_combustible_id)
    formData.append('capacidad', String(data.capacidad))
    formData.append('activo', String(data.activo))

    startTransition(async () => {
      setServerError(null)
      if (mode === 'create') {
        await createSurtidor(formData)
      } else if (id) {
        await updateSurtidor(id, formData)
      }
    })
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Nuevo Surtidor' : 'Editar Surtidor'}
        </CardTitle>
        <CardDescription>
          {mode === 'create'
            ? 'Completa los campos para registrar un nuevo surtidor'
            : 'Modifica los datos del surtidor'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {serverError && (
          <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Surtidor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ej: 1"
                      disabled={isPending}
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
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
              name="capacidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad (litros)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Ej: 5000"
                      disabled={isPending}
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? 'Guardando...'
                  : mode === 'create'
                  ? 'Crear Surtidor'
                  : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
