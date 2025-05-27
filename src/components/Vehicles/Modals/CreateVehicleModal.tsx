// src/components/vehiculos/CreateVehiculoModal.tsx
import { useEffect } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'

// Asume componentes de UI. Si usas Shadcn/ui, estos serán diferentes.
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter
} from '@/components/ui/dialog' // Componente Modal genérico
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select' // Componente Select genérico
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle, Trash2 } from 'lucide-react'
import type {
  EstadoInventario,
  TipoAdquisicion
} from '@/store/types/vehicle.types'
import { useVehiculoStore } from '@/hooks/useVehicleStore'
import { type CreateVehiculoFormType } from '@/schemas/createVehicle.schema'

// Lista de opciones para selects estáticos
const tipoAdquisicionOptions: TipoAdquisicion[] = [
  'Compra Directa',
  'Trade-In',
  'Consignacion',
  'Subasta',
  'Otro'
]
const estadoInventarioOptions: EstadoInventario[] = [
  'Disponible',
  'Reservado',
  'Vendido',
  'En Preparacion',
  'Consignacion',
  'No Disponible'
]

interface CreateVehiculoModalProps {
  isOpen: boolean
  onClose: () => void
}
const initialDefaultValues: CreateVehiculoFormType = {
  // --- Campos Requeridos o con Default en Schema ---
  modelo_id: 0, // Placeholder para "no seleccionado", Zod lo validará con .min(1)
  color_id: 0, // Placeholder
  tipo_transmision_id: 0, // Placeholder
  tipo_combustible_id: 0, // Placeholder
  anio: new Date().getFullYear(),
  vin: '',
  precio_base: 0, // Placeholder, Zod lo validará con .min(0)
  estado_inventario: 'En Preparacion', // Coincide con el .default() del schema

  // --- Adquisición (Objeto anidado) ---
  adquisicion: {
    fecha_adquisicion: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    costo_adquisicion: 0, // Placeholder, Zod lo validará
    tipo_adquisicion: 'Compra Directa',
    empleado_registra_id: 0, // Placeholder, Zod lo validará. DEBES reemplazarlo con el ID real.
    // Opcionales de adquisición (Zod los maneja si no están aquí)
    proveedor_id: undefined,
    cliente_trade_in_id: undefined,
    notas_adquisicion: ''
  },

  // --- Campos Opcionales del Vehículo Principal (Zod los maneja si son undefined/null/'' según el schema) ---
  numero_motor: '',
  numero_chasis: '',
  kilometraje: null, // Schema es .nullable()
  numero_puertas: null, // Schema es .nullable()
  capacidad_pasajeros: null, // Schema es .nullable()
  precio_venta_sugerido: null, // Schema es .nullable()
  descripcion_adicional: '',
  ubicacion_fisica: '',

  // --- Array Opcional ---
  caracteristicasOpcionales: []
}

export function CreateVehiculoModal ({
  isOpen,
  onClose
}: CreateVehiculoModalProps) {
  const {
    createVehiculo,
    isLoadingVehiculos, // Usado para deshabilitar el botón de submit
    loadFormOptions,
    modelosOptions,
    coloresOptions,
    tiposTransmisionOptions,
    tiposCombustibleOptions,
    proveedoresOptions,
    caracteristicasOpcionalesOptions,
    isLoadingOptions
  } = useVehiculoStore()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    register
  } = useForm<CreateVehiculoFormType>({
    // resolver: zodResolver(createVehiculoSchema),
    defaultValues: initialDefaultValues // Usar la variable tipada y completa
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'caracteristicasOpcionales'
  })

  useEffect(() => {
    if (isOpen) {
      loadFormOptions() // Carga las opciones para los selects cuando el modal se abre
    }
  }, [isOpen, loadFormOptions])

  {
    console.log({ modelosOptions, coloresOptions })
  }

  const onSubmit = async (data: CreateVehiculoFormType) => {
    // Aquí deberías obtener el ID del empleado que registra desde tu estado de autenticación.
    // Por ahora, lo pongo como placeholder.
    const empleadoIdPlaceholder = 1 // REEMPLAZAR ESTO
    const dataToSubmit = {
      ...data,
      adquisicion: {
        ...data.adquisicion,
        empleado_registra_id:
          data.adquisicion.empleado_registra_id || empleadoIdPlaceholder, // Asegúrate que este valor se establezca
        // Convierte los strings de números a números si es necesario antes de enviar, Zod ya debería hacerlo si el schema es `z.number()`
        costo_adquisicion: Number(data.adquisicion.costo_adquisicion)
      },
      // Convierte los strings de números a números si es necesario
      precio_base: Number(data.precio_base),
      precio_venta_sugerido: data.precio_venta_sugerido
        ? Number(data.precio_venta_sugerido)
        : undefined,
      kilometraje: data.kilometraje ? Number(data.kilometraje) : undefined,
      numero_puertas: data.numero_puertas
        ? Number(data.numero_puertas)
        : undefined,
      capacidad_pasajeros: data.capacidad_pasajeros
        ? Number(data.capacidad_pasajeros)
        : undefined
    }

    console.log('Data to submit:', dataToSubmit)

    const success = await createVehiculo(dataToSubmit)
    if (success) {
      reset()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='min-w-[700px] max-h-[70vh] overflow-y-auto'>
        <DialogHeader className='flex items-center justify-center mx-auto'>
          <DialogTitle>Registrar Nuevo Vehículo</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid w-full grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3'
        >
          {/* --- Sección Información General del Vehículo --- */}
          <fieldset className='grid grid-cols-1 gap-4 p-4 border rounded md:col-span-3 md:grid-cols-2 lg:grid-cols-3'>
            <legend className='px-2 text-lg font-semibold'>
              Información General
            </legend>

            {/* Modelo */}
            <div className='form-group'>
              <Label htmlFor='modelo_id'>Modelo</Label>
              <Controller
                name='modelo_id'
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={value => field.onChange(Number(value))}
                    value={String(field.value || '')}
                    disabled={isLoadingOptions}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccionar modelo...' />
                    </SelectTrigger>
                    <SelectContent>
                      {modelosOptions?.map(opt => (
                        <SelectItem key={opt.id} value={String(opt.id)}>
                          {opt.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.modelo_id && (
                <p className='text-sm text-red-500'>
                  {errors.modelo_id.message}
                </p>
              )}
            </div>

            {/* Color */}
            <div className='form-group'>
              <Label htmlFor='color_id'>Color</Label>
              <Controller
                name='color_id'
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={value => field.onChange(Number(value))}
                    value={String(field.value || '')}
                    disabled={isLoadingOptions}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccionar color...' />
                    </SelectTrigger>
                    <SelectContent>
                      {coloresOptions?.map(opt => (
                        <SelectItem key={opt.id} value={String(opt.id)}>
                          {opt.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.color_id && (
                <p className='text-sm text-red-500'>
                  {errors.color_id.message}
                </p>
              )}
            </div>

            {/* Año */}
            <div className='form-group'>
              <Label htmlFor='anio'>Año</Label>
              <Input
                id='anio'
                type='number'
                {...register('anio', { valueAsNumber: true })}
              />
              {errors.anio && (
                <p className='text-sm text-red-500'>{errors.anio.message}</p>
              )}
            </div>

            {/* VIN */}
            <div className='form-group'>
              <Label htmlFor='vin'>VIN</Label>
              <Input id='vin' {...register('vin')} />
              {errors.vin && (
                <p className='text-sm text-red-500'>{errors.vin.message}</p>
              )}
            </div>

            {/* Tipo Transmisión */}
            <div className='form-group'>
              <Label htmlFor='tipo_transmision_id'>Tipo de Transmisión</Label>
              <Controller
                name='tipo_transmision_id'
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={value => field.onChange(Number(value))}
                    value={String(field.value || '')}
                    disabled={isLoadingOptions}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccionar transmisión...' />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposTransmisionOptions?.map(opt => (
                        <SelectItem key={opt.id} value={String(opt.id)}>
                          {opt.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo_transmision_id && (
                <p className='text-sm text-red-500'>
                  {errors.tipo_transmision_id.message}
                </p>
              )}
            </div>

            {/* Tipo Combustible */}
            <div className='form-group'>
              <Label htmlFor='tipo_combustible_id'>Tipo de Combustible</Label>
              <Controller
                name='tipo_combustible_id'
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={value => field.onChange(Number(value))}
                    value={String(field.value || '')}
                    disabled={isLoadingOptions}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccionar combustible...' />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposCombustibleOptions?.map(opt => (
                        <SelectItem key={opt.id} value={String(opt.id)}>
                          {opt.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo_combustible_id && (
                <p className='text-sm text-red-500'>
                  {errors.tipo_combustible_id.message}
                </p>
              )}
            </div>

            {/* Kilometraje */}
            <div className='form-group'>
              <Label htmlFor='kilometraje'>Kilometraje</Label>
              <Input
                id='kilometraje'
                type='number'
                {...register('kilometraje', {
                  setValueAs: v => (v === '' ? undefined : parseInt(v, 10))
                })}
              />
              {errors.kilometraje && (
                <p className='text-sm text-red-500'>
                  {errors.kilometraje.message}
                </p>
              )}
            </div>

            {/* Numero de Puertas */}
            <div className='form-group'>
              <Label htmlFor='numero_puertas'>Número de Puertas</Label>
              <Input
                id='numero_puertas'
                type='number'
                {...register('numero_puertas', {
                  setValueAs: v => (v === '' ? undefined : parseInt(v, 10))
                })}
              />
              {errors.numero_puertas && (
                <p className='text-sm text-red-500'>
                  {errors.numero_puertas.message}
                </p>
              )}
            </div>

            {/* Capacidad de Pasajeros */}
            <div className='form-group'>
              <Label htmlFor='capacidad_pasajeros'>
                Capacidad de Pasajeros
              </Label>
              <Input
                id='capacidad_pasajeros'
                type='number'
                {...register('capacidad_pasajeros', {
                  setValueAs: v => (v === '' ? undefined : parseInt(v, 10))
                })}
              />
              {errors.capacidad_pasajeros && (
                <p className='text-sm text-red-500'>
                  {errors.capacidad_pasajeros.message}
                </p>
              )}
            </div>

            {/* Numero Motor */}
            <div className='form-group'>
              <Label htmlFor='numero_motor'>Número de Motor</Label>
              <Input id='numero_motor' {...register('numero_motor')} />
              {errors.numero_motor && (
                <p className='text-sm text-red-500'>
                  {errors.numero_motor.message}
                </p>
              )}
            </div>

            {/* Numero Chasis */}
            <div className='form-group'>
              <Label htmlFor='numero_chasis'>Número de Chasis</Label>
              <Input id='numero_chasis' {...register('numero_chasis')} />
              {errors.numero_chasis && (
                <p className='text-sm text-red-500'>
                  {errors.numero_chasis.message}
                </p>
              )}
            </div>
          </fieldset>

          {/* --- Sección Precios e Inventario --- */}
          <fieldset className='grid grid-cols-1 gap-4 p-4 border rounded md:col-span-3 md:grid-cols-2 lg:grid-cols-3'>
            <legend className='px-2 text-lg font-semibold'>
              Precios e Inventario
            </legend>
            {/* Precio Base */}
            <div className='form-group'>
              <Label htmlFor='precio_base'>Precio Base</Label>
              <Input
                id='precio_base'
                type='number'
                step='0.01'
                {...register('precio_base', { valueAsNumber: true })}
              />
              {errors.precio_base && (
                <p className='text-sm text-red-500'>
                  {errors.precio_base.message}
                </p>
              )}
            </div>

            {/* Precio Venta Sugerido */}
            <div className='form-group'>
              <Label htmlFor='precio_venta_sugerido'>
                Precio Venta Sugerido
              </Label>
              <Input
                id='precio_venta_sugerido'
                type='number'
                step='0.01'
                {...register('precio_venta_sugerido', {
                  setValueAs: v => (v === '' ? undefined : parseFloat(v))
                })}
              />
              {errors.precio_venta_sugerido && (
                <p className='text-sm text-red-500'>
                  {errors.precio_venta_sugerido.message}
                </p>
              )}
            </div>

            {/* Estado Inventario */}
            <div className='form-group'>
              <Label htmlFor='estado_inventario'>Estado en Inventario</Label>
              <Controller
                name='estado_inventario'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccionar estado...' />
                    </SelectTrigger>
                    <SelectContent>
                      {estadoInventarioOptions?.map(opt => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.estado_inventario && (
                <p className='text-sm text-red-500'>
                  {errors.estado_inventario.message}
                </p>
              )}
            </div>

            {/* Ubicacion Fisica */}
            <div className='form-group md:col-span-3'>
              <Label htmlFor='ubicacion_fisica'>Ubicación Física</Label>
              <Input id='ubicacion_fisica' {...register('ubicacion_fisica')} />
              {errors.ubicacion_fisica && (
                <p className='text-sm text-red-500'>
                  {errors.ubicacion_fisica.message}
                </p>
              )}
            </div>

            {/* Descripcion Adicional */}
            <div className='form-group md:col-span-3'>
              <Label htmlFor='descripcion_adicional'>
                Descripción Adicional
              </Label>
              <Textarea
                id='descripcion_adicional'
                {...register('descripcion_adicional')}
              />
              {errors.descripcion_adicional && (
                <p className='text-sm text-red-500'>
                  {errors.descripcion_adicional.message}
                </p>
              )}
            </div>
          </fieldset>

          {/* --- Sección Adquisición --- */}
          <fieldset className='grid grid-cols-1 gap-4 p-4 border rounded md:col-span-3 md:grid-cols-2 lg:grid-cols-3'>
            <legend className='px-2 text-lg font-semibold'>
              Información de Adquisición
            </legend>
            {/* Fecha Adquisición */}
            <div className='form-group'>
              <Label htmlFor='adquisicion.fecha_adquisicion'>
                Fecha de Adquisición
              </Label>
              <Input
                id='adquisicion.fecha_adquisicion'
                type='date'
                {...register('adquisicion.fecha_adquisicion')}
              />
              {errors.adquisicion?.fecha_adquisicion && (
                <p className='text-sm text-red-500'>
                  {errors.adquisicion.fecha_adquisicion.message}
                </p>
              )}
            </div>

            {/* Costo Adquisición */}
            <div className='form-group'>
              <Label htmlFor='adquisicion.costo_adquisicion'>
                Costo de Adquisición
              </Label>
              <Input
                id='adquisicion.costo_adquisicion'
                type='number'
                step='0.01'
                {...register('adquisicion.costo_adquisicion', {
                  valueAsNumber: true
                })}
              />
              {errors.adquisicion?.costo_adquisicion && (
                <p className='text-sm text-red-500'>
                  {errors.adquisicion.costo_adquisicion.message}
                </p>
              )}
            </div>

            {/* Tipo Adquisición */}
            <div className='form-group'>
              <Label htmlFor='adquisicion.tipo_adquisicion'>
                Tipo de Adquisición
              </Label>
              <Controller
                name='adquisicion.tipo_adquisicion'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccionar tipo...' />
                    </SelectTrigger>
                    <SelectContent>
                      {tipoAdquisicionOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.adquisicion?.tipo_adquisicion && (
                <p className='text-sm text-red-500'>
                  {errors.adquisicion.tipo_adquisicion.message}
                </p>
              )}
            </div>

            {/* Proveedor */}
            <div className='form-group'>
              <Label htmlFor='adquisicion.proveedor_id'>Proveedor</Label>
              <Controller
                name='adquisicion.proveedor_id'
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={value =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                    value={String(field.value || '')}
                    disabled={isLoadingOptions}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccionar proveedor (opcional)...' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='null'>
                        <em>Ninguno</em>
                      </SelectItem>
                      {proveedoresOptions?.map(opt => (
                        <SelectItem key={opt.id} value={String(opt.id)}>
                          {opt.contacto.nombre_completo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.adquisicion?.proveedor_id && (
                <p className='text-sm text-red-500'>
                  {errors.adquisicion.proveedor_id.message}
                </p>
              )}
            </div>

            {/* Empleado que registra (Placeholder - Debería ser automático o un select si es necesario) */}
            <div className='form-group'>
              <Label htmlFor='adquisicion.empleado_registra_id'>
                Empleado Registra ID
              </Label>
              <Input
                id='adquisicion.empleado_registra_id'
                type='number'
                {...register('adquisicion.empleado_registra_id', {
                  valueAsNumber: true
                })}
                placeholder='ID Empleado (ej. 1)' // Quitar en producción
              />
              {errors.adquisicion?.empleado_registra_id && (
                <p className='text-sm text-red-500'>
                  {errors.adquisicion.empleado_registra_id.message}
                </p>
              )}
            </div>

            {/* Notas Adquisición */}
            <div className='form-group md:col-span-3'>
              <Label htmlFor='adquisicion.notas_adquisicion'>
                Notas de Adquisición
              </Label>
              <Textarea
                id='adquisicion.notas_adquisicion'
                {...register('adquisicion.notas_adquisicion')}
              />
              {errors.adquisicion?.notas_adquisicion && (
                <p className='text-sm text-red-500'>
                  {errors.adquisicion.notas_adquisicion.message}
                </p>
              )}
            </div>
          </fieldset>

          {/* --- Sección Características Opcionales --- */}
          <fieldset className='p-4 border rounded md:col-span-3'>
            <legend className='px-2 mb-2 text-lg font-semibold'>
              Características Opcionales
            </legend>
            {fields.map((item, index) => (
              <div
                key={item.id}
                className='grid items-center grid-cols-1 gap-4 pb-3 mb-3 border-b md:grid-cols-3'
              >
                <div className='form-group md:col-span-1'>
                  <Label
                    htmlFor={`caracteristicasOpcionales.${index}.caracteristica_id`}
                  >
                    Característica
                  </Label>
                  <Controller
                    name={`caracteristicasOpcionales.${index}.caracteristica_id`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={value => field.onChange(Number(value))}
                        value={String(field.value || '')}
                        disabled={isLoadingOptions}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccionar característica...' />
                        </SelectTrigger>
                        <SelectContent>
                          {caracteristicasOpcionalesOptions?.map(opt => (
                            <SelectItem
                              key={opt.caracteristica_id}
                              value={String(opt.caracteristica_id)}
                            >
                              {opt.valor_caracteristica}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.caracteristicasOpcionales?.[index]
                    ?.caracteristica_id && (
                    <p className='text-sm text-red-500'>
                      {
                        errors.caracteristicasOpcionales[index]
                          ?.caracteristica_id?.message
                      }
                    </p>
                  )}
                </div>
                <div className='form-group md:col-span-1'>
                  <Label
                    htmlFor={`caracteristicasOpcionales.${index}.nombre_caracteristica`}
                  >
                    Valor
                  </Label>
                  <Input
                    id={`caracteristicasOpcionales.${index}.nombre_caracteristica`}
                    {...register(
                      `caracteristicasOpcionales.${index}.valor_caracteristica`
                    )}
                  />
                  {errors.caracteristicasOpcionales?.[index]
                    ?.valor_caracteristica && (
                    <p className='text-sm text-red-500'>
                      {
                        errors.caracteristicasOpcionales[index]
                          ?.valor_caracteristica?.message
                      }
                    </p>
                  )}
                </div>
                <div className='flex items-end form-group md:col-span-1'>
                  <Button
                    type='button'
                    variant='destructive'
                    onClick={() => remove(index)}
                    size='icon'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type='button'
              variant='outline'
              onClick={() =>
                append({ caracteristica_id: 0, valor_caracteristica: '' })
              } // 0 o undefined para caracteristica_id
              className='mt-2'
            >
              <PlusCircle className='w-4 h-4 mr-2' /> Añadir Característica
            </Button>
          </fieldset>
        </form>

        <DialogFooter>
          <Button
            type='button'
            variant='ghost'
            onClick={() => {
              reset()
              onClose()
            }}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            disabled={isLoadingVehiculos || isLoadingOptions}
          >
            {isLoadingVehiculos ? 'Guardando...' : 'Guardar Vehículo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
