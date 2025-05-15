import type { StateCreator } from 'zustand'
import type { EmployeeSliceType } from '../types/employee.types'
import { api } from '@/api/axios'
import toast from 'react-hot-toast'
import type { CreateEmpleadoType } from '@/schemas/createEmployee.schema'

export const createEmployeeSlice: StateCreator<EmployeeSliceType> = (
  set,
  get
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
        console.error('Error al obtener usuarios:', error)
        toast.error('Error al obtener usuarios')
      }
    },
    getEmployeeById: async (id: number) => {
      try {
        const { data } = await api.get(`/employee/${id}`)

        return data?.data
      } catch (error) {
        console.error('Error al obtener usuario por ID:', error)
        toast.error('Error al obtener usuario por ID')
      }
    },
    getContactos: async () => {
      try {
        const { data } = await api.get('/contact')

        set({ contactos: data?.data })
      } catch (error) {
        console.error('Error al obtener contactos:', error)
        toast.error('Error al obtener contactos')
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
    deleteEmployee: async (id: number) => {
      try {
        set({ isLoadingEmployee: true, errorEmployee: null })

        const { data } = await api.delete(`/employee/${id}`)

        set({ isLoadingEmployee: false, employees: data?.data })
        toast.success('Usuario eliminado exitosamente')
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Error al eliminar usuario'

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
