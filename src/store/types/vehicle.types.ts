import type { StateCreator } from 'zustand'
import type { Contacto } from './globalData.type'

export type SelectOption = {
  id: number
  nombre: string
}

export type Marca = {
  id: number
  nombre: string
}
export type ModeloSelectOption = {
  id: number
  nombre: string
  marca: Marca
}

export type ProveedorSelectOption = {
  id: number
  contacto: Contacto
}

export type CaracteristicaOpcionalSelectOption = {
  caracteristica_id: number
  valor_caracteristica: string
}

// --- Tipo para la entidad Adquisicion (parte de la creación del Vehículo) ---
export type TipoAdquisicion =
  | 'Compra Directa'
  | 'Trade-In'
  | 'Consignacion'
  | 'Subasta'
  | 'Otro'

export type EstadoInventario =
  | 'Disponible'
  | 'Reservado'
  | 'Vendido'
  | 'En Preparacion'
  | 'Consignacion'
  | 'No Disponible'

export type AdquisicionCreateType = {
  fecha_adquisicion: string // ISOString date (YYYY-MM-DD)
  costo_adquisicion: number
  tipo_adquisicion: TipoAdquisicion
  proveedor_id?: number
  cliente_trade_in_id?: number // Asumo que también podría existir un cliente_id para trade-in
  empleado_registra_id: number // Debería obtenerse del usuario logueado o un selector
  notas_adquisicion?: string
}

// --- Tipo para Caracteristicas Opcionales al crear un Vehículo ---
export type CaracteristicaOpcionalInput = {
  caracteristica_id: number
  valor_caracteristica: string // El JSON de ejemplo muestra "Sí" o un texto
}

// --- Tipo para un Vehículo (tal como se recibe del GET /vehiculos) ---
// Este tipo refleja el JSON que me proporcionaste para la lista de vehículos.
export type Vehiculo = {
  id: string // o number, ajusta según tu backend
  modelo_id: string // o number
  color_id: string // o number
  tipo_transmision_id: string // o number
  tipo_combustible_id: string // o number
  anio: number
  vin: string
  numero_motor: string | null
  numero_chasis: string | null
  kilometraje: number | null
  numero_puertas: number | null
  capacidad_pasajeros: number | null
  precio_base: string // o number
  precio_venta_sugerido: string | null // o number
  descripcion_adicional: string | null
  estado_inventario: EstadoInventario
  fecha_ingreso_sistema: string // ISOString date
  ubicacion_fisica: string | null
  modelo: {
    id: string // o number
    marca_id: string // o number
    nombre: string
    marca: {
      id: string // o number
      nombre: string
    }
  }
  color: {
    id: string // o number
    nombre: string
  }
  tipo_transmision: {
    id: string // o number
    nombre: string
  }
  tipo_combustible: {
    id: string // o number
    nombre: string
  }
  adquisicion: {
    // Ajusta según lo que realmente devuelva el GET /vehiculos para la adquisición anidada
    id: string // o number
    vehiculo_id: string // o number
    fecha_adquisicion: string // ISOString date (YYYY-MM-DD)
    costo_adquisicion: string // o number
    tipo_adquisicion: TipoAdquisicion
    proveedor_id: string | null // o number
    cliente_trade_in_id: string | null // o number
    empleado_registra_id: string // o number
    notas_adquisicion: string | null
  } | null // La adquisición podría no estar siempre presente o ser opcional al listar
  caracteristicas: Array<{
    caracteristica_id: string // o number
    valor_caracteristica: string
    // VehiculoCaracteristicaOpcional: {} // Puede que no necesitemos este detalle en la lista
  }> | null // Las características podrían ser opcionales o no siempre presentes
}

// --- Tipo para los datos del formulario de creación de Vehículo ---
// Basado en el JSON que proporcionaste para la creación.
export type CreateVehiculoType = {
  modelo_id: number
  color_id: number
  tipo_transmision_id: number
  tipo_combustible_id: number
  anio: number // Asegúrate de que sea number, no string
  vin: string
  numero_motor?: string
  numero_chasis?: string
  kilometraje?: number
  numero_puertas?: number
  capacidad_pasajeros?: number
  precio_base: number // Asegúrate de que sea number
  precio_venta_sugerido?: number
  descripcion_adicional?: string
  estado_inventario: EstadoInventario // O un valor por defecto si no se envía
  ubicacion_fisica?: string
  adquisicion: AdquisicionCreateType
  caracteristicasOpcionales?: CaracteristicaOpcionalInput[]
}

// --- Tipo para el estado del slice de Vehiculo ---
export type VehiculoSliceState = {
  vehiculos: Vehiculo[] | null
  isLoadingVehiculos: boolean
  errorVehiculos: string | null

  // Para los selects del formulario
  modelosOptions: ModeloSelectOption[] | null
  coloresOptions: SelectOption[] | null
  tiposTransmisionOptions: SelectOption[] | null
  tiposCombustibleOptions: SelectOption[] | null
  proveedoresOptions: ProveedorSelectOption[] | null
  caracteristicasOpcionalesOptions: CaracteristicaOpcionalSelectOption[] | null

  isLoadingOptions: boolean // Un solo loading para todas las opciones o individuales
  errorOptions: string | null
}

// --- Tipo para el Slice completo (Estado + Acciones) ---
export type VehiculoSliceType = VehiculoSliceState & {
  // Acciones CRUD Vehiculo
  getVehiculos: () => Promise<void>
  createVehiculo: (data: CreateVehiculoType) => Promise<boolean> // Devuelve true si éxito
  deleteVehiculo: (vehiculoId: number) => Promise<boolean> // Devuelve true si éxito

  // Acciones para cargar opciones de los selects
  getModelosOptions: () => Promise<void>
  getColoresOptions: () => Promise<void>
  getTiposTransmisionOptions: () => Promise<void>
  getTiposCombustibleOptions: () => Promise<void>
  getProveedoresOptions: () => Promise<void>
  getCaracteristicasOpcionalesOptions: () => Promise<void>

  // Podríamos tener una acción que cargue todas las opciones necesarias a la vez
  loadFormOptions: () => Promise<void>

  clearVehiculoErrors: () => void
}
export type VehiculoStateCreator = StateCreator<
  VehiculoSliceType,
  [],
  [],
  VehiculoSliceType
>
