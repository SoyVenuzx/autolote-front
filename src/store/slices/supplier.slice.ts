import type { StateCreator } from 'zustand'
import type { SupplierSliceType } from '../types/supplier.type'

import toast from 'react-hot-toast'
import { api } from '@/api/axios'

export const createSupplierSlice: StateCreator<SupplierSliceType> = (
  set,
  _
) => {
  return {
    suppliers: [],
    contactos: [],
    isLoadingSupplier: false,
    errorSupplier: null,

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

        return data?.data || null
      } catch (error) {
        console.error('Error al obtener proveedor por ID:', error)
        toast.error('Error al obtener proveedor por ID')
      }
    }
  }
}
