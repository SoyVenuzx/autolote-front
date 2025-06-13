import type {
  CreateEmpleadoType,
  UpdateEmpleadoType
} from '@/schemas/createEmployee.schema'
import type { Contacto } from './globalData.type'

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
  updateEmployee: (id: number, data: UpdateEmpleadoType) => Promise<void>

  getEmployees: () => Promise<void>
  getEmployeeById: (id: number) => Promise<Employee | null>
  getPuestos: () => Promise<void>
}
