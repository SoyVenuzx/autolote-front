import { Store } from '@/store/store'

export const useEmployeeStore = () => {
  return {
    isLoading: Store(state => state.isLoadingEmployee),
    error: Store(state => state.error),
    employees: Store(state => state.employees),
    contactos: Store(state => state.contactos),
    puestos: Store(state => state.puestos),
    createEmployee: Store(state => state.createEmployee),
    updateEmployee: Store(state => state.updateEmployee),
    deleteEmployee: Store(state => state.deleteEmployee),
    getEmployees: Store(state => state.getEmployees),
    getEmployeeById: Store(state => state.getEmployeeById),
    getPuestos: Store(state => state.getPuestos)
  }
}
