import { z } from 'zod'

export const createPrecioSchema = z.object({
  tipo_combustible_id: z.string().min(1, 'Selecciona un tipo de combustible'),
  precio_por_litro: z.coerce.number().positive('El precio debe ser mayor a 0'),
  fecha_inicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
  fecha_fin: z.string().optional().nullable(),
})

export const updatePrecioSchema = createPrecioSchema.partial()

export type CreatePrecioInput = z.infer<typeof createPrecioSchema>
export type UpdatePrecioInput = z.infer<typeof updatePrecioSchema>
