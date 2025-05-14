import type {
  CreateUserType,
  UpdateUserType
} from '@/schemas/createUser.schema'
import type { LogInType } from '@/schemas/login.schema'
import type { RegisterData, User } from '@/types/auth.types'
import type { TableUser, UpdateUser } from '@/types/users.type'

export type UserSliceType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  users: TableUser[] | null

  // Acciones
  login: (credentials: LogInType) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  hasRole: (requiredRoles: string[]) => boolean
  refreshUser: () => Promise<void>
  checkCookies: () => Record<string, string> | null
  checkAuth: Promise<
    | (User & {
        token: string
      })
    | null
  >
  getUsers: () => Promise<void>
  getUserById: (userId: string) => Promise<UpdateUser | null>

  createUser: (data: CreateUserType) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  updateUser: (userId: string, data: UpdateUserType) => Promise<void>
}
