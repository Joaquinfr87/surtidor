import { z } from 'zod'

export const createSurtidorSchema = z.object({
  numero: z.coerce.number().int().positive('El número debe ser positivo'),
  tipo_combustible_id: z.string().min(1, 'Selecciona un tipo de combustible'),
  capacidad: z.coerce.number().positive('La capacidad debe ser mayor a 0'),
  activo: z.boolean().default(true),
})

export const updateSurtidorSchema = createSurtidorSchema.partial()

export type CreateSurtidorInput = z.infer<typeof createSurtidorSchema>
export type UpdateSurtidorInput = z.infer<typeof updateSurtidorSchema>
