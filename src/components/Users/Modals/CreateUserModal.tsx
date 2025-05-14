import { Button } from '@/components/ui/button'
import { DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Asterisk, Eye, EyeOff, Mail, Shield, UserIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateUserSchema,
  UpdateUserSchema,
  type CreateUserType,
  type UpdateUserType
} from '@/schemas/createUser.schema'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/hooks/useAuthStore'
import { Spinner } from '@/components/ui/spinner'

type CreateUserModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing?: boolean
  userId?: string | null
}
type UserFormType = CreateUserType | UpdateUserType

export const CreateUserModal = ({
  open,
  onOpenChange,
  isEditing = false,
  userId = null
}: CreateUserModalProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)

  const { isLoading, createUser, updateUser, error, getUserById } =
    useAuthStore()

  const formSchema = isEditing ? UpdateUserSchema : CreateUserSchema

  const form = useForm<UserFormType>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur'
  })

  useEffect(() => {
    if (!isEditing) return
    if (!userId) return

    const fetchUser = async () => {
      setLoading(true)

      const user = await getUserById(userId)
      console.log({ usuarioEdit: user })

      if (!user) return

      form.setValue('username', user.username)
      form.setValue('email', user.email)
      form.setValue('role', user.roles[0].name as 'admin' | 'user')

      setLoading(false)
    }

    fetchUser()
  }, [open])

  useEffect(() => {
    if (!open) {
      form.reset()
      setShowPassword(false)
      setShowConfirmPassword(false)
    }
  }, [open])

  const onSubmit = async (data: UserFormType) => {
    console.log('Datos creación de usuario', data)

    if (!isEditing) {
      await createUser(data as CreateUserType)
    } else {
      if (!userId) return

      await updateUser(userId, data as UpdateUserType)
    }

    if (!error) onOpenChange(false)
  }

  if (loading) {
    return <Spinner size={'medium'} />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] p-0 overflow-hidden rounded-lg'>
        <DialogHeader className='py-2 border-b bg-gray-50'>
          <DialogTitle className='text-xl font-semibold text-center text-gray-800'>
            {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='px-5 py-2'>
            <div className='space-y-6'>
              <div className='space-y-3'>
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <div className='space-y-2'>
                        <FormLabel
                          htmlFor='username'
                          className='flex items-center text-sm font-medium'
                        >
                          <UserIcon className='w-4 h-4 mr-2 text-gray-500' />
                          Nombre de Usuario
                        </FormLabel>
                        <FormControl>
                          <Input
                            id='username'
                            {...field}
                            className='border-gray-200 focus:border-blue-500'
                            placeholder='Ingrese nombre de usuario'
                            required={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <div className='space-y-2'>
                        <FormLabel
                          htmlFor='email'
                          className='flex items-center text-sm font-medium'
                        >
                          <Mail className='w-4 h-4 mr-2 text-gray-500' />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            id='email'
                            {...field}
                            className='border-gray-200 focus:border-blue-500'
                            placeholder='ejemplo@correo.com'
                            required={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <div className='space-y-2'>
                        <FormLabel
                          htmlFor='role'
                          className='flex items-center text-sm font-medium'
                        >
                          <Shield className='w-4 h-4 mr-2 text-gray-500' />
                          Rol
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='border-gray-200 focus:border-blue-500'>
                              <SelectValue placeholder='Seleccionar rol' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='user'>Usuario</SelectItem>
                            <SelectItem value='admin'>Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <div className='space-y-2'>
                        <FormLabel
                          htmlFor='password'
                          className='flex items-center text-sm font-medium'
                        >
                          <Asterisk className='w-4 h-4 mr-2 text-gray-500' />
                          Contraseña
                        </FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              id='password'
                              type={showPassword ? 'text' : 'password'}
                              {...field}
                              placeholder='••••••••'
                              required={!isEditing}
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
                                {showPassword
                                  ? 'Ocultar contraseña'
                                  : 'Mostrar contraseña'}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <div className='space-y-2'>
                        <FormLabel
                          htmlFor='confirmPassword'
                          className='flex items-center text-sm font-medium'
                        >
                          <Asterisk className='w-4 h-4 mr-2 text-gray-500' />
                          Confirmar Contraseña
                        </FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              id='password'
                              type={showConfirmPassword ? 'text' : 'password'}
                              {...field}
                              placeholder='••••••••'
                              required={!isEditing}
                            />

                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='absolute -translate-y-1/2 right-2 top-1/2'
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
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
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className='gap-2 mt-6 mb-3 sm:gap-0'>
              <Button
                type='submit'
                className='transition-colors bg-blue-600 hover:bg-blue-700'
              >
                {isLoading ? 'Cargando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
