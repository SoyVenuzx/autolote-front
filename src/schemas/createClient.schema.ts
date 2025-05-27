import { z } from 'zod'

export const createClientSchema = z.object({
  contacto_id: z.number({
    required_error: 'El contacto es requerido',
    invalid_type_error: 'El contacto debe ser un número'
  }),
  notas_cliente: z.string({
    required_error: 'Las notas son requeridas',
    invalid_type_error: 'Las notas deben ser un string'
  }),
  activo: z.boolean().default(true)
})

export const updateClientSchema = createClientSchema.partial()

export type CreateClientType = z.infer<typeof createClientSchema>
export type UpdateClientType = z.infer<typeof updateClientSchema>
export type ClientFormType = CreateClientType | UpdateClientType
