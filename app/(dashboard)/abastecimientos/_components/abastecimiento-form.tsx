'use client'

import { useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  createAbastecimientoSchema,
  type CreateAbastecimientoInput,
} from '@/lib/schemas/abastecimiento'
import { createAbastecimiento } from '../actions'

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
import { SearchSelect, type SelectOption } from '@/components/ui/search-select'

interface Props {
  surtidores: SelectOption[]
  proveedores: SelectOption[]
  tiposCombustible: SelectOption[]
}

export function AbastecimientoForm({ surtidores, proveedores, tiposCombustible }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [serverError, setServerError] = useState<string | null>(
    error ? decodeURIComponent(error) : null
  )

  const form = useForm<CreateAbastecimientoInput>({
    resolver: zodResolver(createAbastecimientoSchema as any) as any,
    defaultValues: {
      surtidor_id: undefined,
      proveedor_id: undefined,
      tipo_combustible_id: '',
      litros: undefined,
      precio_por_litro: undefined,
      costo_total: undefined,
      factura: '',
    },
  })

  function onSubmit(data: CreateAbastecimientoInput) {
    const formData = new FormData()
    formData.append('surtidor_id', String(data.surtidor_id))
    formData.append('proveedor_id', String(data.proveedor_id))
    formData.append('tipo_combustible_id', data.tipo_combustible_id)
    formData.append('litros', String(data.litros))
    formData.append('precio_por_litro', String(data.precio_por_litro))
    formData.append('costo_total', String(data.costo_total))
    if (data.factura) formData.append('factura', data.factura)

    startTransition(async () => {
      setServerError(null)
      await createAbastecimiento(formData)
    })
  }

  const litros = form.watch('litros') ?? 0
  const precioPorLitro = form.watch('precio_por_litro') ?? 0

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Nuevo Abastecimiento</CardTitle>
        <CardDescription>Registra un nuevo reabastecimiento de combustible</CardDescription>
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
              name="proveedor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <FormControl>
                    <SearchSelect
                      options={proveedores}
                      value={field.value ? String(field.value) : ''}
                      onChange={(val) => field.onChange(val ? Number(val) : undefined)}
                      placeholder="Selecciona un proveedor..."
                      searchPlaceholder="Buscar proveedor..."
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

            <div className="grid grid-cols-2 gap-4">
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
                name="precio_por_litro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio/L (Bs.)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0" disabled={isPending} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="costo_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costo Total (Bs.)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder={String(litros * precioPorLitro || 0)} disabled={isPending} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="factura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° Factura (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Número de factura" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>{isPending ? 'Guardando...' : 'Registrar Abastecimiento'}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
