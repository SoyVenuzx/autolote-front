import type { StateCreator } from 'zustand'
import type { Cliente, ClienteSliceType } from '../types/client.type'
import { api } from '@/api/axios'
import toast from 'react-hot-toast'
import type {
  CreateClientType,
  UpdateClientType
} from '@/schemas/createClient.schema'

export const createClienteSlice: StateCreator<ClienteSliceType> = (set, _) => {
  return {
    clients: [],
    isLoadingClient: false,
    errorClient: null,

    getClients: async () => {
      try {
        const { data } = await api.get('/client')

        set({ clients: data?.data })
      } catch (error) {
        console.error('Error al obtener clientes:', error)
        toast.error('Error al obtener clientes')
      }
    },
    getClientById: async (id: number) => {
      try {
        const { data } = await api.get(`/client/${id}`)

        return data?.data
      } catch (error) {
        console.error('Error al obtener cliente por ID:', error)
        toast.error('Error al obtener cliente ID')
      }
    },

    createClient: async (formData: CreateClientType) => {
      set({ isLoadingClient: true, errorClient: null })
      try {
        const { data } = await api.post('/client', formData)

        set({ isLoadingClient: false, clients: data?.data })

        toast.success('Registro exitoso')
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Error al registrarse'

        toast.error(errorMessage)

        set({
          isLoadingClient: false,
          errorClient: errorMessage
        })

        throw error
      }
    },
    updateClient: async (id: number, formData: UpdateClientType) => {
      set({ isLoadingClient: true, errorClient: null })
      try {
        const { data } = await api.put<{ message: string; data: Cliente[] }>(
          `/client/${id}`,
          formData
        )

        set({ isLoadingClient: false, clients: data?.data })
        toast.success('Cliente actualizado exitosamente')
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Error al actualizar cliente'

        toast.error(errorMessage)

        set({
          isLoadingClient: false,
          errorClient: errorMessage
        })

        throw error
      }
    },
    deleteClient: async (id: number) => {
      try {
        set({ isLoadingClient: true, errorClient: null })

        const { data } = await api.delete(`/client/${id}`)

        set({ isLoadingClient: false, clients: data?.data })

        toast.success('Cliente eliminado exitosamente')
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Error al eliminar cliente'

        toast.error(errorMessage)

        set({
          isLoadingClient: false,
          errorClient: errorMessage
        })

        throw error
      }
    }
  }
}
