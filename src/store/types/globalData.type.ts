export interface Contacto {
  id: number
  nombre_completo: string
  nombre_empresa?: string
  email: string
  dni_ruc: string
}

export type GlobalSliceType = {
  contactos: Contacto[]

  getContactos: () => Promise<void>
}
