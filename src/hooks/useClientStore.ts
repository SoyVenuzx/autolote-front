import { Store } from '@/store/store'

export const useClientStore = () => {
  return {
    isLoading: Store(state => state.isLoadingClient),
    error: Store(state => state.errorClient),

    clients: Store(state => state.clients),

    getClients: Store(state => state.getClients),
    getClientById: Store(state => state.getClientById),

    createClient: Store(state => state.createClient),
    deleteClient: Store(state => state.deleteClient)
  }
}
