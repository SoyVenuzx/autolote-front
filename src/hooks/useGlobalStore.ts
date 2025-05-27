import { Store } from '@/store/store'

export const useGlobalStore = () => {
  return {
    contactos: Store(state => state.contactos),
    getContactos: Store(state => state.getContactos)
  }
}
