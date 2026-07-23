import { z } from 'zod'

export const createVentaSchema = z.object({
  surtidor_id: z.coerce.number().int().positive('Selecciona un surtidor'),
  tipo_combustible_id: z.string().min(1, 'Selecciona un tipo de combustible'),
  litros: z.coerce.number().positive('Los litros deben ser mayor a 0'),
  notas: z.string().optional(),
})

export const updateVentaSchema = z.object({
  anulada: z.boolean(),
})

export type CreateVentaInput = z.infer<typeof createVentaSchema>
export type UpdateVentaInput = z.infer<typeof updateVentaSchema>
