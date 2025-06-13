import type {
  createProveedorType,
  updateProveedortype
} from '@/schemas/createSupplier.schema'
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

  createSupplier: (formData: createProveedorType) => Promise<void>
  deleteSupplier: (id: string) => Promise<void>
  updateSupplier: (id: string, data: updateProveedortype) => Promise<void>

  getSuppliers: () => Promise<void>
  getSupplierById: (id: string) => Promise<Supplier | null>
}
