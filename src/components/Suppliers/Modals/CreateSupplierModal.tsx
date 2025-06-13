import { useGlobalStore } from '@/hooks/useGlobalStore'
import { useSupplierStore } from '@/hooks/useSupplierStore'
import {
  createProveedorSchema,
  updateProveedorSchema,
  type ProveedorFormType
} from '@/schemas/createSupplier.schema'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { CalendarIcon, CheckIcon, User, UserIcon, XIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger } from '@radix-ui/react-popover'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { es } from 'date-fns/locale'
import { Checkbox } from '@/components/ui/checkbox'
import { type createProveedorType } from '../../../schemas/createSupplier.schema'

type CreateSupplierModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing?: boolean
  proveedorId?: number | null
}

export const CreateSupplierModal = ({
  open,
  onOpenChange,
  isEditing = false,
  proveedorId = null
}: CreateSupplierModalProps) => {
  const [loading, setLoading] = useState(false)

  const { contactos } = useGlobalStore()

  const { isLoading, getSupplierById, createSupplier, updateSupplier } =
    useSupplierStore()

  const formSchema = isEditing ? updateProveedorSchema : createProveedorSchema

  const form = useForm<ProveedorFormType>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      activo: true,
      fecha_contratacion: new Date()
    }
  })

  useEffect(() => {
    if (!isEditing || !proveedorId) return
    const fetchProveedor = async () => {
      setLoading(true)

      try {
        const proveedor = await getSupplierById(proveedorId?.toString())
        console.log({ proveedor })

        if (proveedor) {
          form.setValue('contacto_id', parseInt(proveedor.contacto_id))
          form.setValue('tipo_proveedor', proveedor.tipo_proveedor)

          if (proveedor.fecha_registro_proveedor) {
            form.setValue(
              'fecha_contratacion',
              new Date(proveedor.fecha_registro_proveedor)
            )
          }

          form.setValue('fecha_desvinculacion', null)
          form.setValue('activo', proveedor.activo)
        }
      } catch (error) {
        console.error('Error al cargar datos del proveedor:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProveedor()
  }, [open, proveedorId, isEditing, getSupplierById])

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  const handleSubmit = async (data: ProveedorFormType) => {
    try {
      if (!isEditing) await createSupplier(data as createProveedorType)
      else {
        if (!proveedorId) return
        await updateSupplier(proveedorId.toString(), data)
      }

      onOpenChange(false)
    } catch (error) {
      console.error('Error al guardar proveedor:', error)
    }
  }

  if (loading) {
    return <Spinner size='medium' />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] p-0 overflow-hidden rounded-lg'>
        <DialogHeader className='py-2 border-b bg-gray-50'>
          <DialogTitle className='font-semibold text-center text-gray-800 text-l'>
            {isEditing ? 'Editar Proveedor' : 'Crear Proveedor'}
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

              {/* Tipo Proveedor */}
              <FormField
                control={form.control}
                name='tipo_proveedor'
                render={({ field }) => (
                  <FormItem>
                    <div className='space-y-2'>
                      <FormLabel
                        htmlFor='email'
                        className='flex items-center text-sm font-medium'
                      >
                        <User className='w-4 h-4 mr-2 text-gray-500' />
                        Tipo de Proveedor
                      </FormLabel>
                      <FormControl>
                        <Input
                          id='tipo_proveedor'
                          {...field}
                          className='border-gray-200 focus:border-blue-500'
                          placeholder='Ingrese el tipo de proveedor'
                          required={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Fecha de Contratación */}
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
                          // onSelect={date => handleDesvinculacionChange(date)}
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
                        // onClick={() => {
                        //   handleDesvinculacionChange(undefined)
                        //   form.setValue('activo', true)
                        // }}
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
                        // onCheckedChange={handleActivoChange}
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
                  ? 'Actualizar Proveedor'
                  : 'Crear Proveedor'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
