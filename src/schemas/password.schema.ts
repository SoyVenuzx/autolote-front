import { z } from 'zod'

const minLengthErrorMessage = 'La contraseña debe tener al menos 8 caracteres'
const maxLengthErrorMessage =
  'La contraseña no puede tener más de 20 caracteres'
const uppercaseErrorMessage =
  'La contraseña debe contener al menos una letra mayúscula'
const lowercaseErrorMessage =
  'La contraseña debe contener al menos una letra minúscula'
const numberErrorMessage = 'La contraseña debe contener al menos un número'
const specialCharacterErrorMessage =
  'La contraseña debe contener al menos un carácter especial'

export const passwordSchema = z
  .string()
  .min(8, { message: minLengthErrorMessage })
  .max(20, { message: maxLengthErrorMessage })
  .refine(password => /[A-Z]/.test(password), {
    message: uppercaseErrorMessage
  })
  .refine(password => /[a-z]/.test(password), {
    message: lowercaseErrorMessage
  })
  .refine(password => /[0-9]/.test(password), { message: numberErrorMessage })
  .refine(password => /[!@#$%^&*]/.test(password), {
    message: specialCharacterErrorMessage
  })
