import { z } from 'zod'

export const createProveedorSchema = z.object({
  contacto_id: z.number({
    required_error: 'El contacto es requerido'
  }),
  tipo_proveedor: z
    .string({
      required_error: 'El tipo de proveedor es requerido'
    })
    .min(1, {
      message: 'El tipo de proveedor no puede estar vacío'
    }),
  fecha_contratacion: z.date({
    required_error: 'La fecha de contratación es requerida'
  }),
  fecha_desvinculacion: z.date().nullable().optional(),
  activo: z.boolean().default(true)
})

export const updateProveedorSchema = createProveedorSchema.partial()

export type createProveedorType = z.infer<typeof createProveedorSchema>
export type updateProveedortype = z.infer<typeof updateProveedorSchema>

export type ProveedorFormType = createProveedorType | updateProveedortype
