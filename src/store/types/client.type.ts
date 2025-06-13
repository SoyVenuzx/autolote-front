import type {
  CreateClientType,
  UpdateClientType
} from '@/schemas/createClient.schema'
import type { Contacto } from './globalData.type'

export interface Cliente {
  id: string
  contacto_id: string
  fecha_registro_cliente: Date
  notas_cliente: string
  activo: boolean
  contacto: Contacto
}

export type ClienteSliceType = {
  clients: Cliente[]
  isLoadingClient: boolean
  errorClient: string | null

  getClients: () => Promise<void>
  getClientById: (id: number) => Promise<Cliente | null>

  createClient: (data: CreateClientType) => Promise<void>
  updateClient: (id: number, data: UpdateClientType) => Promise<void>
  deleteClient: (id: number) => Promise<void>
}
