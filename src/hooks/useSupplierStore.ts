import { Store } from '@/store/store'

export const useSupplierStore = () => {
  return {
    isLoading: Store(state => state.isLoadingSupplier),
    error: Store(state => state.errorSupplier),

    suppliers: Store(state => state.suppliers),
    contactos: Store(state => state.contactos),

    createSupplier: Store(state => state.createSupplier),
    updateSupplier: Store(state => state.updateSupplier),
    deleteSupplier: Store(state => state.deleteSupplier),

    getSuppliers: Store(state => state.getSuppliers),
    getSupplierById: Store(state => state.getSupplierById)
  }
}
