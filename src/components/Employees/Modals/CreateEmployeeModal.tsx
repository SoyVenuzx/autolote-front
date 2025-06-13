import { Button } from '@/components/ui/button'
import { DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  CalendarIcon,
  UserIcon,
  BriefcaseIcon,
  CheckIcon,
  XIcon
} from 'lucide-react'
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
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { useEmployeeStore } from '@/hooks/useEmployeeStore'
import {
  createEmpleadoSchema,
  updateEmpleadoSchema,
  type CreateEmpleadoType,
  type EmpleadoFormType
} from '@/schemas/createEmployee.schema'
import { useGlobalStore } from '@/hooks/useGlobalStore'

type CreateEmpleadoModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing?: boolean
  empleadoId?: number | null
}

export const CreateEmpleadoModal = ({
  open,
  onOpenChange,
  isEditing = false,
  empleadoId = null
}: CreateEmpleadoModalProps) => {
  const [loading, setLoading] = useState(false)

  const { contactos } = useGlobalStore()

  const {
    isLoading,
    getEmployeeById,
    puestos,
    createEmployee,
    updateEmployee
  } = useEmployeeStore()

  const formSchema = isEditing ? updateEmpleadoSchema : createEmpleadoSchema

  const form = useForm<EmpleadoFormType>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      activo: true,
      fecha_contratacion: new Date()
    }
  })

  // Cargar datos del empleado para edición
  useEffect(() => {
    if (!isEditing || !empleadoId) return

    const fetchEmpleado = async () => {
      setLoading(true)
      try {
        const empleado = await getEmployeeById(empleadoId)

        if (empleado) {
          form.setValue('contacto_id', parseInt(empleado.contacto_id))
          form.setValue('puesto_id', parseInt(empleado.puesto_id))

          // Convertir strings de fecha a objetos Date para el formulario
          if (empleado.fecha_contratacion) {
            form.setValue(
              'fecha_contratacion',
              new Date(empleado.fecha_contratacion)
            )
          }

          if (empleado.fecha_desvinculacion) {
            form.setValue(
              'fecha_desvinculacion',
              new Date(empleado.fecha_desvinculacion)
            )
          } else {
            form.setValue('fecha_desvinculacion', null)
          }

          form.setValue('activo', empleado.activo)
        }
      } catch (error) {
        console.error('Error al cargar empleado:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmpleado()
  }, [open, empleadoId, isEditing, getEmployeeById])

  // Resetear formulario al cerrar
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  // Manejar envío del formulario
  const handleSubmit = async (data: EmpleadoFormType) => {
    try {
      if (!isEditing) await createEmployee(data as CreateEmpleadoType)
      else {
        if (!empleadoId) return

        await updateEmployee(empleadoId, data)
      }

      onOpenChange(false)
    } catch (error) {
      console.error('Error al guardar empleado:', error)
    }
  }

  // Manejar cambio en checkbox de activo
  const handleActivoChange = (checked: boolean) => {
    form.setValue('activo', checked)

    // Si se marca como inactivo y no hay fecha de desvinculación, establecer la fecha actual
    if (!checked && !form.getValues('fecha_desvinculacion')) {
      form.setValue('fecha_desvinculacion', new Date())
    }

    // Si se marca como activo, eliminar fecha de desvinculación
    if (checked) {
      form.setValue('fecha_desvinculacion', null)
    }
  }

  // Manejar cambio en fecha de desvinculación
  const handleDesvinculacionChange = (date: Date | undefined) => {
    if (date) {
      form.setValue('fecha_desvinculacion', date)
      form.setValue('activo', false)
    } else {
      form.setValue('fecha_desvinculacion', null)
    }
  }

  if (loading) {
    return <Spinner size='medium' />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] p-0 overflow-hidden rounded-lg'>
        <DialogHeader className='py-2 border-b bg-gray-50'>
          <DialogTitle className='text-xl font-semibold text-center text-gray-800'>
            {isEditing ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='px-5 py-4'
          >
            <div className='space-y-4'>
              {/* Contacto */}
              <FormField
                control={form.control}
                name='contacto_id'
                render={({ field }) => (
                  <FormItem>
                    <div className='space-y-2'>
                      <FormLabel
                        htmlFor='contacto_id'
                        className='flex items-center text-sm font-medium'
                      >
                        <UserIcon className='w-4 h-4 mr-2 text-gray-500' />
                        Contacto
                      </FormLabel>
                      <Select
                        onValueChange={value => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                        disabled={isEditing} // Deshabilitar cambio de contacto en edición
                      >
                        <FormControl>
                          <SelectTrigger className='border-gray-200 focus:border-blue-500'>
                            <SelectValue placeholder='Seleccionar contacto' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contactos.map(contacto => (
                            <SelectItem
                              key={contacto.id}
                              value={contacto.id.toString()}
                            >
                              {contacto.nombre_completo} - {contacto.dni_ruc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Puesto */}
              <FormField
                control={form.control}
                name='puesto_id'
                render={({ field }) => (
                  <FormItem>
                    <div className='space-y-2'>
                      <FormLabel
                        htmlFor='puesto_id'
                        className='flex items-center text-sm font-medium'
                      >
                        <BriefcaseIcon className='w-4 h-4 mr-2 text-gray-500' />
                        Puesto
                      </FormLabel>
                      <Select
                        onValueChange={value => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className='border-gray-200 focus:border-blue-500'>
                            <SelectValue placeholder='Seleccionar puesto' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {puestos.map(puesto => (
                            <SelectItem
                              key={puesto.id}
                              value={puesto.id.toString()}
                            >
                              {puesto.nombre_puesto}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Fecha de contratación */}
              <FormField
                control={form.control}
                name='fecha_contratacion'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='flex items-center text-sm font-medium'>
                      <CalendarIcon className='w-4 h-4 mr-2 text-gray-500' />
                      Fecha de Contratación
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className='w-4 h-4 ml-auto opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date =>
                            date > new Date() ||
                            (form.getValues('fecha_desvinculacion') !== null &&
                              form.getValues('fecha_desvinculacion') !==
                                undefined &&
                              date > form.getValues('fecha_desvinculacion')!)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha de desvinculación */}
              <FormField
                control={form.control}
                name='fecha_desvinculacion'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='flex items-center text-sm font-medium'>
                      <CalendarIcon className='w-4 h-4 mr-2 text-gray-500' />
                      Fecha de Desvinculación
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: es })
                            ) : (
                              <span>Sin fecha de desvinculación</span>
                            )}
                            <CalendarIcon className='w-4 h-4 ml-auto opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value || undefined}
                          onSelect={date => handleDesvinculacionChange(date)}
                          disabled={date =>
                            date < form.getValues('fecha_contratacion')! ||
                            date > new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                    {field.value && (
                      <Button
                        type='button'
                        variant='ghost'
                        className='mt-1 text-xs text-red-500 w-fit hover:text-red-700'
                        onClick={() => {
                          handleDesvinculacionChange(undefined)
                          form.setValue('activo', true)
                        }}
                      >
                        Eliminar fecha de desvinculación
                      </Button>
                    )}
                  </FormItem>
                )}
              />

              {/* Estado activo */}
              <FormField
                control={form.control}
                name='activo'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={handleActivoChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel className='flex items-center'>
                        {field.value ? (
                          <CheckIcon className='w-4 h-4 mr-2 text-green-500' />
                        ) : (
                          <XIcon className='w-4 h-4 mr-2 text-red-500' />
                        )}
                        Estado
                      </FormLabel>
                      <p className='text-sm text-muted-foreground'>
                        {field.value ? 'Empleado activo' : 'Empleado inactivo'}
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className='gap-2 mt-6 mb-3 sm:gap-0'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                className='transition-colors bg-blue-600 hover:bg-blue-700'
                disabled={isLoading}
              >
                {isLoading
                  ? 'Guardando...'
                  : isEditing
                  ? 'Actualizar Empleado'
                  : 'Crear Empleado'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
