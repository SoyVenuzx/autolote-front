import type { StateCreator } from 'zustand'
import type { GlobalSliceType } from '../types/globalData.type'
import toast from 'react-hot-toast'
import { api } from '@/api/axios'

export const createGlobalSlice: StateCreator<GlobalSliceType> = (set, _) => {
  return {
    contactos: [],

    getContactos: async () => {
      try {
        const { data } = await api.get('/contact')

        set({ contactos: data?.data })
      } catch (error) {
        console.error('Error al obtener contactos:', error)
        toast.error('Error al obtener contactos')
      }
    }
  }
}
