'use client'

import { useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  createProveedorSchema,
  type CreateProveedorInput,
} from '@/lib/schemas/proveedor'
import { createProveedor, updateProveedor } from '../actions'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

interface Props {
  mode: 'create' | 'edit'
  initialData?: Partial<CreateProveedorInput>
  id?: number
}

export function ProveedorForm({ mode, initialData, id }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [serverError, setServerError] = useState<string | null>(
    error ? decodeURIComponent(error) : null
  )

  const form = useForm<CreateProveedorInput>({
    resolver: zodResolver(createProveedorSchema as any) as any,
    defaultValues: {
      nombre: initialData?.nombre ?? '',
      nit: initialData?.nit ?? '',
      contacto: initialData?.contacto ?? '',
      telefono: initialData?.telefono ?? '',
      email: initialData?.email ?? '',
      direccion: initialData?.direccion ?? '',
      activo: initialData?.activo ?? true,
    },
  })

  function onSubmit(data: CreateProveedorInput) {
    const formData = new FormData()
    formData.append('nombre', data.nombre)
    if (data.nit) formData.append('nit', data.nit)
    if (data.contacto) formData.append('contacto', data.contacto)
    if (data.telefono) formData.append('telefono', data.telefono)
    if (data.email) formData.append('email', data.email)
    if (data.direccion) formData.append('direccion', data.direccion)
    formData.append('activo', String(data.activo))

    startTransition(async () => {
      setServerError(null)
      if (mode === 'create') {
        await createProveedor(formData)
      } else if (id) {
        await updateProveedor(id, formData)
      }
    })
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Nuevo Proveedor' : 'Editar Proveedor'}
        </CardTitle>
        <CardDescription>
          {mode === 'create'
            ? 'Completa los campos para registrar un nuevo proveedor'
            : 'Modifica los datos del proveedor'}
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
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del proveedor" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIT</FormLabel>
                  <FormControl>
                    <Input placeholder="Opcional" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contacto</FormLabel>
                    <FormControl>
                      <Input placeholder="Persona de contacto" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Teléfono" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@ejemplo.com" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección completa" disabled={isPending} {...field} />
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
                  ? 'Crear Proveedor'
                  : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
