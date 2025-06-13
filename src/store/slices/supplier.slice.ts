import type { StateCreator } from 'zustand'
import type { Supplier, SupplierSliceType } from '../types/supplier.type'

import toast from 'react-hot-toast'
import { api } from '@/api/axios'
import type {
  createProveedorType,
  updateProveedortype
} from '@/schemas/createSupplier.schema'

export const createSupplierSlice: StateCreator<SupplierSliceType> = (
  set,
  _
) => {
  return {
    suppliers: [],
    contactos: [],
    isLoadingSupplier: false,
    errorSupplier: null,

    createSupplier: async (formData: createProveedorType) => {
      set({ isLoadingSupplier: true, errorSupplier: null })

      try {
        const { data } = await api.post('/supplier', formData)

        set({ isLoadingSupplier: false, suppliers: data?.data })
        toast.success('Proveedor registrado exitosamente')
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Error al registrarse'

        toast.error(errorMessage)

        set({
          isLoadingSupplier: false,
          errorSupplier: errorMessage
        })

        throw error
      }
    },
    updateSupplier: async (id: string, formData: updateProveedortype) => {
      set({ isLoadingSupplier: true, errorSupplier: null })

      try {
        const { data } = await api.put<{ message: string; data: Supplier[] }>(
          `/supplier/${id}`,
          formData
        )

        set({ isLoadingSupplier: false, suppliers: data?.data })
        toast.success('Proveedor actualizado exitosamente')
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Error al actualizar proveedor'

        toast.error(errorMessage)

        set({
          isLoadingSupplier: false,
          errorSupplier: errorMessage
        })

        throw error
      }
    },
    deleteSupplier: async (id: string) => {
      try {
        set({ isLoadingSupplier: true, errorSupplier: null })

        const { data } = await api.delete(`/supplier/${id}`)

        set({ isLoadingSupplier: false, suppliers: data?.data })
        toast.success('Proveedor eliminado exitosamente')
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Error al eliminar Empleado'

        toast.error(errorMessage)

        set({
          isLoadingSupplier: false,
          errorSupplier: errorMessage
        })

        throw error
      }
    },
    getSuppliers: async () => {
      try {
        const { data } = await api.get('/supplier')

        set({ suppliers: data?.data })
      } catch (error) {
        console.error('Error al obtener proveedores.', error)
        toast.error('Error al obtener proveedores.')
      }
    },
    getSupplierById: async (id: string) => {
      try {
        const { data } = await api.get(`/supplier/${id}`)

        return data || null
      } catch (error) {
        console.error('Error al obtener proveedor por ID:', error)
        toast.error('Error al obtener proveedor por ID')
      }
    }
  }
}
