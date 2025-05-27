import {
  DialogHeader,
  Dialog,
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
import { Spinner } from '@/components/ui/spinner'
import { useClientStore } from '@/hooks/useClientStore'
import { useGlobalStore } from '@/hooks/useGlobalStore'
import {
  createClientSchema,
  updateClientSchema,
  type ClientFormType,
  type CreateClientType
} from '@/schemas/createClient.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { CheckIcon, Notebook, UserIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'

type CreateClientModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing?: boolean
  clientId?: number | null
}

export const CreateClientModal = ({
  open,
  onOpenChange,
  isEditing = false,
  clientId = null
}: CreateClientModalProps) => {
  const [loading, setLoading] = useState(false)

  const { contactos } = useGlobalStore()

  const { isLoading, getClientById, createClient } = useClientStore()

  const formSchema = isEditing ? updateClientSchema : createClientSchema

  const form = useForm<ClientFormType>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      activo: true
    }
  })

  useEffect(() => {
    if (!isEditing || !clientId) return

    const fetchCliente = async () => {
      setLoading(true)
      try {
        const cliente = await getClientById(clientId)

        if (cliente) {
          form.setValue('contacto_id', parseInt(cliente.contacto_id))
          form.setValue('activo', cliente.activo)
        }
      } catch (error) {
        console.error('Error al cargar cliente:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCliente()
  }, [open, clientId, isEditing, getClientById])

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  const handleActivoChange = (checked: boolean) => {
    form.setValue('activo', checked)
  }

  // Manejar envío del formulario
  const handleSubmit = async (data: ClientFormType) => {
    try {
      if (!isEditing) {
        await createClient(data as CreateClientType)
      } else if (!clientId) {
        return
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Error al guardar cliente:', error)
    }
  }

  if (loading) return <Spinner size='medium' />

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] p-0 overflow-hidden rounded-lg'>
        <DialogHeader className='py-2 border-b bg-gray-50'>
          <DialogTitle className='text-xl font-semibold text-center text-gray-800'>
            {isEditing ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
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

              <FormField
                control={form.control}
                name='notas_cliente'
                render={({ field }) => (
                  <FormItem>
                    <div className='space-y-2'>
                      <FormLabel
                        htmlFor='notas_client'
                        className='flex items-center text-sm font-medium'
                      >
                        <Notebook className='w-4 h-4 mr-2 text-gray-500' />
                        Nota de Cliente
                      </FormLabel>
                      <FormControl>
                        <Input
                          id='notas_cliente'
                          {...field}
                          className='border-gray-200 focus:border-blue-500'
                          placeholder='Cliente VIP, Cliente frecuente, etc.'
                          required={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
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
                        {field.value ? 'Cliente activo' : 'Cliente inactivo'}
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
                  ? 'Actualizar  Cliente'
                  : 'Crear Cliente'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
