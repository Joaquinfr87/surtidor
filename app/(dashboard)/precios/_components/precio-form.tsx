'use client'

import { useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  createPrecioSchema,
  type CreatePrecioInput,
} from '@/lib/schemas/precio'
import { createPrecio, updatePrecio } from '../actions'

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
  initialData?: Partial<CreatePrecioInput>
  id?: number
  tiposCombustible: SelectOption[]
}

export function PrecioForm({ mode, initialData, id, tiposCombustible }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [serverError, setServerError] = useState<string | null>(
    error ? decodeURIComponent(error) : null
  )

  const form = useForm<CreatePrecioInput>({
    resolver: zodResolver(createPrecioSchema as any) as any,
    defaultValues: {
      tipo_combustible_id: initialData?.tipo_combustible_id ?? '',
      precio_por_litro: initialData?.precio_por_litro ?? undefined,
      fecha_inicio: initialData?.fecha_inicio ?? '',
      fecha_fin: initialData?.fecha_fin ?? '',
    },
  })

  function onSubmit(data: CreatePrecioInput) {
    const formData = new FormData()
    formData.append('tipo_combustible_id', data.tipo_combustible_id)
    formData.append('precio_por_litro', String(data.precio_por_litro))
    formData.append('fecha_inicio', data.fecha_inicio)
    if (data.fecha_fin) formData.append('fecha_fin', data.fecha_fin)

    startTransition(async () => {
      setServerError(null)
      if (mode === 'create') {
        await createPrecio(formData)
      } else if (id) {
        await updatePrecio(id, formData)
      }
    })
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Nuevo Precio' : 'Editar Precio'}
        </CardTitle>
        <CardDescription>
          {mode === 'create'
            ? 'Registra un nuevo precio para un tipo de combustible'
            : 'Modifica el precio del combustible'}
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
              name="precio_por_litro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio por Litro (Bs.)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Ej: 3.50"
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
              name="fecha_inicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Inicio</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fecha_fin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Fin (opcional)</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isPending} {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : mode === 'create' ? 'Crear Precio' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
