import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../components/ui/card'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpSchema, type SignUpType } from '@/schemas/signup.schema'
import { useAuthStore } from '@/hooks/useAuthStore'

export default function SignupPage () {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register: createUser, error, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpType>({
    resolver: zodResolver(SignUpSchema),
    mode: 'onBlur'
  })

  const onSubmit = async (data: SignUpType) => {
    console.log('Datos de registro: ', data)
    await createUser(data)
    // Simulate signup - in a real app, you would create the user
    if (!error) navigate('/dashboard')
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-4 bg-zinc-50'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Crear Cuenta</CardTitle>
          <CardDescription>
            Ingresa tus datos para registrarte en el sistema
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>Nombre de Usuario</Label>
                <Input
                  id='username'
                  placeholder='nombre de usuario'
                  {...register('username')}
                  aria-invalid={errors.username ? 'true' : 'false'}
                />
                {errors.username && (
                  <p className='text-sm text-red-500'>
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Correo Electrónico</Label>
              <Input
                id='email'
                type='email'
                placeholder='correo@ejemplo.com'
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Contraseña</Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  {...register('password')}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute -translate-y-1/2 right-2 top-1/2'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                  <span className='sr-only'>
                    {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  </span>
                </Button>
              </div>
              {errors.password && (
                <p className='text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirmar Contraseña</Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  {...register('confirmPassword')}
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                />

                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute -translate-y-1/2 right-2 top-1/2'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                  <span className='sr-only'>
                    {showConfirmPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'}
                  </span>
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className='text-sm text-red-500'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <Button type='submit' className='w-full'>
              {isLoading ? 'Cargando...' : 'Registrarse'}
            </Button>
            <div className='text-sm text-red-500'>
              {error && <p>{error}</p>}
            </div>
            <div className='text-sm text-center'>
              ¿Ya tienes una cuenta?{' '}
              <Link
                to='/login'
                className='font-medium underline underline-offset-4'
              >
                Iniciar Sesión
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
