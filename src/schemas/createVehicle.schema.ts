import { z } from 'zod'

const estadoInventarioEnum = z.enum([
  'Disponible',
  'Reservado',
  'Vendido',
  'En Preparacion',
  'Consignacion',
  'No Disponible'
])

const tipoAdquisicionEnum = z.enum([
  'Compra Directa',
  'Trade-In',
  'Consignacion',
  'Subasta',
  'Otro'
])

// Schema para Adquisicion (parte de la creación del Vehículo)
const adquisicionSchema = z.object({
  fecha_adquisicion: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha de adquisición inválida'
  }),
  costo_adquisicion: z
    .number()
    .min(0, 'El costo de adquisición debe ser positivo'),
  tipo_adquisicion: tipoAdquisicionEnum,
  proveedor_id: z.number().optional(),
  cliente_trade_in_id: z.number().optional(),
  empleado_registra_id: z.number({
    required_error: 'El empleado que registra es requerido'
  }),
  notas_adquisicion: z.string().optional()
})

// Schema para Caracteristicas Opcionales
const caracteristicaOpcionalInputSchema = z.object({
  caracteristica_id: z
    .number({
      required_error: 'Debe seleccionar una característica',
      invalid_type_error: 'ID de característica debe ser un número'
    })
    .min(1, 'Debe seleccionar una característica válida'),
  valor_caracteristica: z
    .string()
    .min(1, 'El valor de la característica es requerido')
})

// Schema principal para la creación del Vehículo
export const createVehiculoSchema = z.object({
  modelo_id: z
    .number({ required_error: 'El modelo es requerido' })
    .min(1, 'Debe seleccionar un modelo'),
  color_id: z
    .number({ required_error: 'El color es requerido' })
    .min(1, 'Debe seleccionar un color'),
  tipo_transmision_id: z
    .number({ required_error: 'El tipo de transmisión es requerido' })
    .min(1, 'Debe seleccionar un tipo de transmisión'),
  tipo_combustible_id: z
    .number({ required_error: 'El tipo de combustible es requerido' })
    .min(1, 'Debe seleccionar un tipo de combustible'),
  anio: z
    .number({ required_error: 'El año es requerido' })
    .min(1900, 'El año debe ser mayor o igual a 1900')
    .max(
      new Date().getFullYear() + 2,
      `El año no puede ser mayor a ${new Date().getFullYear() + 2}`
    ),
  vin: z
    .string()
    .min(1, 'El VIN es requerido')
    .max(17, 'El VIN no debe exceder los 17 caracteres'),
  numero_motor: z.string().optional(),
  numero_chasis: z.string().optional(),
  kilometraje: z
    .number()
    .min(0, 'El kilometraje debe ser positivo')
    .optional()
    .nullable(),
  numero_puertas: z
    .number()
    .min(1, 'Debe tener al menos 1 puerta')
    .max(9)
    .optional()
    .nullable(),
  capacidad_pasajeros: z
    .number()
    .min(1, 'Debe tener capacidad para al menos 1 pasajero')
    .optional()
    .nullable(),
  precio_base: z
    .number({ required_error: 'El precio base es requerido' })
    .min(0, 'El precio base debe ser positivo'),
  precio_venta_sugerido: z
    .number()
    .min(0, 'El precio de venta sugerido debe ser positivo')
    .optional()
    .nullable(),
  descripcion_adicional: z.string().optional(),
  estado_inventario: estadoInventarioEnum.default('En Preparacion'),
  ubicacion_fisica: z.string().optional(),

  adquisicion: adquisicionSchema,
  caracteristicasOpcionales: z
    .array(caracteristicaOpcionalInputSchema)
    .optional()
})

export type CreateVehiculoFormType = z.infer<typeof createVehiculoSchema>
