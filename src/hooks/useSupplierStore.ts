import { Store } from '@/store/store'

export const useSupplierStore = () => {
  return {
    isLoading: Store(state => state.isLoadingSupplier),
    error: Store(state => state.errorSupplier),

    suppliers: Store(state => state.suppliers),
    contactos: Store(state => state.contactos),

    getSuppliers: Store(state => state.getSuppliers),
    getSupplierById: Store(state => state.getSupplierById)
  }
}
