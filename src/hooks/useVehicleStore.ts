import { Store } from '@/store/store' // Ajusta la ruta a tu store principal

export const useVehiculoStore = () => {
  return {
    // Estado de Vehículos
    vehiculos: Store(state => state.vehiculos),
    isLoadingVehiculos: Store(state => state.isLoadingVehiculos),
    errorVehiculos: Store(state => state.errorVehiculos),

    // Estado de Opciones para Selects
    modelosOptions: Store(state => state.modelosOptions),
    coloresOptions: Store(state => state.coloresOptions),
    tiposTransmisionOptions: Store(state => state.tiposTransmisionOptions),
    tiposCombustibleOptions: Store(state => state.tiposCombustibleOptions),
    proveedoresOptions: Store(state => state.proveedoresOptions),
    caracteristicasOpcionalesOptions: Store(
      state => state.caracteristicasOpcionalesOptions
    ),
    isLoadingOptions: Store(state => state.isLoadingOptions),
    errorOptions: Store(state => state.errorOptions),

    // Acciones CRUD Vehiculo
    getVehiculos: Store(state => state.getVehiculos),
    createVehiculo: Store(state => state.createVehiculo),
    deleteVehiculo: Store(state => state.deleteVehiculo),

    // Acciones para cargar opciones de los selects
    getModelosOptions: Store(state => state.getModelosOptions),
    getColoresOptions: Store(state => state.getColoresOptions),
    getTiposTransmisionOptions: Store(
      state => state.getTiposTransmisionOptions
    ),
    getTiposCombustibleOptions: Store(
      state => state.getTiposCombustibleOptions
    ),
    getProveedoresOptions: Store(state => state.getProveedoresOptions),
    getCaracteristicasOpcionalesOptions: Store(
      state => state.getCaracteristicasOpcionalesOptions
    ),
    loadFormOptions: Store(state => state.loadFormOptions),

    // Otras Acciones
    clearVehiculoErrors: Store(state => state.clearVehiculoErrors)
  }
}
