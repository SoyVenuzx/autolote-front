import { z } from 'zod'
import { passwordSchema } from './password.schema'

const passwordMismatchErrorMessage =
  'Las contraseñas no coinciden. Por favor, verifica que ambas sean iguales'

export const UpdateUserSchema = z
  .object({
    username: z
      .string()
      .min(2, {
        message: 'El nombre de usuario debe tener al menos 2 caracteres'
      })
      .max(15, {
        message: 'El nombre de usuario no puede tener más de 15 caracteres'
      })
      .optional(),
    email: z.string().email('El correo ingresado no es válido').optional(),
    role: z.enum(['user', 'admin']).optional(),
    password: passwordSchema.optional(),
    confirmPassword: z.string().optional()
  })
  .refine(
    data => {
      // Solo validar que las contraseñas coincidan si se proporciona una contraseña
      if (data.password) {
        return data.password === data.confirmPassword
      }
      // Si no hay contraseña, la validación pasa
      return true
    },
    {
      message: passwordMismatchErrorMessage,
      path: ['confirmPassword']
    }
  )
  // Al menos un campo debe estar presente
  .refine(
    data => {
      return Object.values(data).some(value => value !== undefined)
    },
    {
      message: 'Debe proporcionar al menos un campo para actualizar',
      path: ['_errors']
    }
  )

export const CreateUserSchema = z
  .object({
    username: z
      .string({ required_error: 'Campo Requerido' })
      .min(2, {
        message: 'El nombre de usuario debe tener al menos 2 caracteres'
      })
      .max(15, {
        message: 'El nombre de usuario no puede tener más de 15 caracteres'
      }),
    email: z
      .string({ required_error: 'Campo Requerido' })
      .email('El correo ingresado no es válido'),
    role: z.enum(['user', 'admin']),
    password: passwordSchema,
    confirmPassword: z.string({
      required_error: 'Debe confirmar su contraseña'
    })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: passwordMismatchErrorMessage,
    path: ['confirmPassword']
  })

export type CreateUserType = z.infer<typeof CreateUserSchema>
export type UpdateUserType = z.infer<typeof UpdateUserSchema>
