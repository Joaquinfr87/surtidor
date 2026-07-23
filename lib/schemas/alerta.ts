import { z } from 'zod'

export const createAlertaSchema = z.object({
  surtidor_id: z.coerce.number().int().positive('Selecciona un surtidor'),
  tipo: z.enum(['bajo', 'critico'], {
    message: 'Selecciona un tipo de alerta',
  }),
})

export const resolverAlertaSchema = z.object({
  resuelto_por: z.string().uuid(),
})

export type CreateAlertaInput = z.infer<typeof createAlertaSchema>
export type ResolverAlertaInput = z.infer<typeof resolverAlertaSchema>
