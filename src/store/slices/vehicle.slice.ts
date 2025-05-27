import type { StateCreator } from 'zustand'
import type {
  CaracteristicaOpcionalSelectOption,
  CreateVehiculoType,
  ModeloSelectOption,
  ProveedorSelectOption,
  SelectOption,
  Vehiculo,
  VehiculoSliceState,
  VehiculoSliceType,
  VehiculoStateCreator
} from '../types/vehicle.types'
import { api } from '@/api/axios'
import toast from 'react-hot-toast'

const initialState = {
  vehiculos: null,
  isLoadingVehiculos: false,
  errorVehiculos: null,

  modelosOptions: null,
  coloresOptions: null,
  tiposTransmisionOptions: null,
  tiposCombustibleOptions: null,
  proveedoresOptions: null,
  caracteristicasOpcionalesOptions: null,

  isLoadingOptions: false,
  errorOptions: null
}

export const createVehiculoSlice: VehiculoStateCreator = (set, get) => ({
  ...initialState,

  // --- Acciones CRUD Vehiculo ---
  getVehiculos: async () => {
    set({ isLoadingVehiculos: true, errorVehiculos: null })
    try {
      const { data } = await api.get<{
        data: Vehiculo[]
        totalItems: number
        totalPages: number
        currentPage: number
      }>('/vehicle') // Asumiendo paginación en la respuesta

      set({ vehiculos: data?.data, isLoadingVehiculos: false })
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error al obtener los vehículos'
      toast.error(errorMessage)
      set({ isLoadingVehiculos: false, errorVehiculos: errorMessage })
    }
  },

  createVehiculo: async (formData: CreateVehiculoType) => {
    set({ isLoadingVehiculos: true, errorVehiculos: null })
    try {
      // El backend ya devuelve la lista actualizada, así que no necesitamos hacer un getVehiculos() explícito si la respuesta es la misma
      const { data } = await api.post<{ data: Vehiculo[] }>(
        '/vehicle',
        formData
      ) // Asumiendo que devuelve la lista de vehículos actualizada
      set({ vehiculos: data.data, isLoadingVehiculos: false })
      toast.success('Vehículo registrado exitosamente')
      return true
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error al registrar el vehículo'
      toast.error(errorMessage)
      set({ isLoadingVehiculos: false, errorVehiculos: errorMessage })
      return false
    }
  },

  deleteVehiculo: async (vehiculoId: number) => {
    set({ isLoadingVehiculos: true, errorVehiculos: null })
    try {
      // Asumiendo que el backend devuelve la lista actualizada tras eliminar
      const { data } = await api.delete<{ data: Vehiculo[] }>(
        `/vehicle/${vehiculoId}`
      )
      set({ vehiculos: data.data, isLoadingVehiculos: false })
      toast.success('Vehículo eliminado exitosamente')
      return true
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error al eliminar el vehículo'
      toast.error(errorMessage)
      set({ isLoadingVehiculos: false, errorVehiculos: errorMessage })
      return false
    }
  },

  // --- Acciones para cargar opciones de los selects ---
  getModelosOptions: async () => {
    set({ isLoadingOptions: true, errorOptions: null })
    try {
      const dataForm = await api.get<{ data: ModeloSelectOption[] }>(
        '/test/modelo'
      ) // Ajusta el tipo de respuesta si es necesario
      const { data } = dataForm.data
      set({ modelosOptions: data, isLoadingOptions: false })
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error al obtener los modelos'
      toast.error(errorMessage)
      set({ isLoadingOptions: false, errorOptions: errorMessage }) // Podrías setear un error específico para modelos
    }
  },

  getColoresOptions: async () => {
    set({ isLoadingOptions: true, errorOptions: null })
    try {
      const formData = await api.get<{ data: SelectOption[] }>('/test/color')
      const { data } = formData.data

      set({ coloresOptions: data, isLoadingOptions: false })
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error al obtener los colores'
      // toast.error(errorMessage); // Evitar múltiples toasts si loadFormOptions falla en uno
      set({
        isLoadingOptions: false,
        errorOptions: get().errorOptions
          ? `${get().errorOptions}, ${errorMessage}`
          : errorMessage
      })
    }
  },

  getTiposTransmisionOptions: async () => {
    set({ isLoadingOptions: true, errorOptions: null })
    try {
      const formData = await api.get<{ data: SelectOption[] }>(
        '/test/transmision'
      )
      const { data } = formData.data

      set({ tiposTransmisionOptions: data, isLoadingOptions: false })
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Error al obtener los tipos de transmisión'
      set({
        isLoadingOptions: false,
        errorOptions: get().errorOptions
          ? `${get().errorOptions}, ${errorMessage}`
          : errorMessage
      })
    }
  },

  getTiposCombustibleOptions: async () => {
    set({ isLoadingOptions: true, errorOptions: null })
    try {
      const formData = await api.get<{ data: SelectOption[] }>(
        '/test/combustible'
      )
      const { data } = formData.data

      set({ tiposCombustibleOptions: data, isLoadingOptions: false })
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Error al obtener los tipos de combustible'
      set({
        isLoadingOptions: false,
        errorOptions: get().errorOptions
          ? `${get().errorOptions}, ${errorMessage}`
          : errorMessage
      })
    }
  },

  getProveedoresOptions: async () => {
    set({ isLoadingOptions: true, errorOptions: null })
    try {
      const {
        data: { data }
      } = await api.get<{ data: ProveedorSelectOption[] }>('/supplier')

      set({ proveedoresOptions: data, isLoadingOptions: false })
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error al obtener los proveedores'
      set({
        isLoadingOptions: false,
        errorOptions: get().errorOptions
          ? `${get().errorOptions}, ${errorMessage}`
          : errorMessage
      })
    }
  },

  getCaracteristicasOpcionalesOptions: async () => {
    set({ isLoadingOptions: true, errorOptions: null })
    try {
      const {
        data: { data }
      } = await api.get<{ data: CaracteristicaOpcionalSelectOption[] }>(
        '/test/vehiculo-caracteristica'
      )
      set({ caracteristicasOpcionalesOptions: data, isLoadingOptions: false })
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Error al obtener las características opcionales'
      set({
        isLoadingOptions: false,
        errorOptions: get().errorOptions
          ? `${get().errorOptions}, ${errorMessage}`
          : errorMessage
      })
    }
  },

  loadFormOptions: async () => {
    set({ isLoadingOptions: true, errorOptions: null })
    // Usamos Promise.allSettled para intentar cargar todas las opciones incluso si alguna falla.
    const results = await Promise.allSettled([
      get().getModelosOptions(),
      get().getColoresOptions(),
      get().getTiposTransmisionOptions(),
      get().getTiposCombustibleOptions(),
      get().getProveedoresOptions(),
      get().getCaracteristicasOpcionalesOptions()
    ])

    // Consolidar errores si alguna promesa fue rechazada
    const errors = results
      .filter(result => result.status === 'rejected' && result.reason)
      .map(
        result =>
          (result as PromiseRejectedResult).reason?.message ||
          'Error desconocido cargando opciones'
      )
      .join(', ')

    if (errors) {
      toast.error(`Error al cargar algunas opciones: ${errors}`)
      set({ errorOptions: errors, isLoadingOptions: false })
    } else {
      set({ isLoadingOptions: false }) // Todas cargaron bien o los errores se manejaron individualmente
    }
    // El estado isLoadingOptions se maneja dentro de cada función getXyzOptions,
    // pero lo reseteamos aquí al final si no hubo errores generales.
    // Si alguna falla, el errorOptions general se seteará.
  },

  clearVehiculoErrors: () => {
    set({ errorVehiculos: null, errorOptions: null })
  }
})
