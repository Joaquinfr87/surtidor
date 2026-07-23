import { z } from 'zod'

export const createAbastecimientoSchema = z.object({
  surtidor_id: z.coerce.number().int().positive('Selecciona un surtidor'),
  proveedor_id: z.coerce.number().int().positive('Selecciona un proveedor'),
  tipo_combustible_id: z.string().min(1, 'Selecciona un tipo de combustible'),
  litros: z.coerce.number().positive('Los litros deben ser mayor a 0'),
  precio_por_litro: z.coerce.number().positive('El precio debe ser mayor a 0'),
  costo_total: z.coerce.number().positive('El costo debe ser mayor a 0'),
  factura: z.string().optional(),
})

export const updateAbastecimientoSchema = createAbastecimientoSchema.partial()

export type CreateAbastecimientoInput = z.infer<typeof createAbastecimientoSchema>
export type UpdateAbastecimientoInput = z.infer<typeof updateAbastecimientoSchema>
