import { z } from 'zod'

export const createTurnoSchema = z.object({
  operador_id: z.string().uuid('Selecciona un operador'),
  supervisor_id: z.string().uuid().optional().nullable(),
  inicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
  notas: z.string().optional(),
})

export const updateTurnoSchema = z.object({
  fin: z.string().optional(),
  cerrado: z.boolean().optional(),
  notas: z.string().optional(),
})

export type CreateTurnoInput = z.infer<typeof createTurnoSchema>
export type UpdateTurnoInput = z.infer<typeof updateTurnoSchema>
