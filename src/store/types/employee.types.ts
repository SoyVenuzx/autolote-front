import type {
  CreateEmpleadoType,
  UpdateEmpleadoType
} from '@/schemas/createEmployee.schema'

export interface Employee {
  id: string
  contacto_id: string
  puesto_id: string
  fecha_contratacion: Date
  fecha_desvinculacion: null
  activo: boolean
  contacto: Contacto
  puesto: Puesto
}

export interface Contacto {
  id: number
  nombre_completo: string
  email: string
  dni_ruc: string
}

export interface Puesto {
  id: number
  nombre_puesto: string
}

export type EmployeeSliceType = {
  employees: Employee[]
  puestos: Puesto[]
  contactos: Contacto[]
  isLoadingEmployee: boolean
  errorEmployee: string | null

  createEmployee: (data: CreateEmpleadoType) => Promise<void>
  deleteEmployee: (id: number) => Promise<void>

  getEmployees: () => Promise<void>
  getEmployeeById: (id: number) => Promise<Employee | null>
  getPuestos: () => Promise<void>
  getContactos: () => Promise<void>
}
