import { z } from 'zod'
import { passwordSchema } from './password.schema'

export const LogInSchema = z.object({
  email: z
    .string({ required_error: 'Campo Requerido' })
    .email('El correo ingresado no es válido'),
  password: z
    .string({ required_error: 'Campo Requerido' })
    .min(8, 'La contraseña no es válida')
})

export type LogInType = z.infer<typeof LogInSchema>
