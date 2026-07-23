import { z } from 'zod'

export const createProveedorSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  nit: z.string().optional(),
  contacto: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  direccion: z.string().optional(),
  activo: z.boolean().default(true),
})

export const updateProveedorSchema = createProveedorSchema.partial()

export type CreateProveedorInput = z.infer<typeof createProveedorSchema>
export type UpdateProveedorInput = z.infer<typeof updateProveedorSchema>
