import type { LogInType } from '@/schemas/login.schema'
import type { User } from '@/types/auth.types'

export type UserSliceType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Acciones
  login: (credentials: LogInType) => Promise<void>
  register: (data: {
    username: string
    email: string
    password: string
  }) => Promise<void>
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
}
