import type { Contacto } from './globalData.type'

export interface Supplier {
  id: string
  contacto_id: string
  tipo_proveedor: string
  fecha_registro_proveedor: Date
  activo: boolean
  contacto: Contacto
}

export type SupplierSliceType = {
  suppliers: Supplier[]
  contactos: Contacto[]
  isLoadingSupplier: boolean
  errorSupplier: string | null

  getSuppliers: () => Promise<void>
  getSupplierById: (id: string) => Promise<Supplier | null>
}
