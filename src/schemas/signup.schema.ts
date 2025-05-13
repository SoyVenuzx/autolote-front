import { z } from 'zod'
import { passwordSchema } from './password.schema'

const passwordMismatchErrorMessage =
  'Las contraseñas no coinciden. Por favor, verifica que ambas sean iguales'

export const SignUpSchema = z
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
    password: passwordSchema,
    confirmPassword: z.string({
      required_error: 'Debe confirmar  su contraseña'
    })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: passwordMismatchErrorMessage,
    path: ['confirmPassword']
  })

export type SignUpType = z.infer<typeof SignUpSchema>
