import type { StateCreator } from 'zustand'
import type { Employee, EmployeeSliceType } from '../types/employee.types'
import { api } from '@/api/axios'
import toast from 'react-hot-toast'
import type {
  CreateEmpleadoType,
  UpdateEmpleadoType
} from '@/schemas/createEmployee.schema'

export const createEmployeeSlice: StateCreator<EmployeeSliceType> = (
  set,
  _
) => {
  return {
    employees: [],
    puestos: [],
    contactos: [],
    isLoadingEmployee: false,
    errorEmployee: null,

    getEmployees: async () => {
      try {
        const { data } = await api.get('/employee')

        set({ employees: data?.data })
      } catch (error) {
        console.error('Error al obtener empleados:', error)
        toast.error('Error al obtener empleados')
      }
    },
    getEmployeeById: async (id: number) => {
      try {
        const { data } = await api.get(`/employee/${id}`)

        return data
      } catch (error) {
        console.error('Error al obtener empleado por ID:', error)
        toast.error('Error al obtener empleado por ID')
      }
    },
    getPuestos: async () => {
      try {
        const { data } = await api.get('/position')

        set({ puestos: data?.data })
      } catch (error) {
        console.error('Error al obtener puestos:', error)
        toast.error('Error al obtener puestos')
      }
    },

    createEmployee: async (formData: CreateEmpleadoType) => {
      set({ isLoadingEmployee: true, errorEmployee: null })
      try {
        const { data } = await api.post('/employee', formData)

        set({ isLoadingEmployee: false, employees: data?.data })
        toast.success('Registro exitoso')
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Error al registrarse'

        toast.error(errorMessage)

        set({
          isLoadingEmployee: false,
          errorEmployee: errorMessage
        })

        throw error
      }
    },
    updateEmployee: async (id: number, dataForm: UpdateEmpleadoType) => {
      set({ isLoadingEmployee: true, errorEmployee: null })
      try {
        const { data } = await api.put<{ message: string; data: Employee[] }>(
          `/employee/${id}`,
          dataForm
        )

        set({ isLoadingEmployee: false, employees: data?.data })
        toast.success('Empleado actualizado exitosamente')
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Error al actualizar empleado'

        toast.error(errorMessage)

        set({
          isLoadingEmployee: false,
          errorEmployee: errorMessage
        })

        throw error
      }
    },
    deleteEmployee: async (id: number) => {
      try {
        set({ isLoadingEmployee: true, errorEmployee: null })

        const { data } = await api.delete(`/employee/${id}`)

        set({ isLoadingEmployee: false, employees: data?.data })
        toast.success('Empleado eliminado exitosamente')
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Error al eliminar Empleado'

        toast.error(errorMessage)

        set({
          isLoadingEmployee: false,
          errorEmployee: errorMessage
        })

        throw error
      }
    }
  }
}
