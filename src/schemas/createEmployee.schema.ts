import { z } from 'zod'

// Esquema Zod para validaciones
export const createEmpleadoSchema = z.object({
  contacto_id: z.number({
    required_error: 'El contacto es requerido'
  }),
  puesto_id: z.number({
    required_error: 'El puesto es requerido'
  }),
  fecha_contratacion: z.date({
    required_error: 'La fecha de contratación es requerida'
  }),
  fecha_desvinculacion: z.date().nullable().optional(),
  activo: z.boolean().default(true)
})

export const updateEmpleadoSchema = createEmpleadoSchema.partial()

export type CreateEmpleadoType = z.infer<typeof createEmpleadoSchema>
export type UpdateEmpleadoType = z.infer<typeof updateEmpleadoSchema>
export type EmpleadoFormType = CreateEmpleadoType | UpdateEmpleadoType
