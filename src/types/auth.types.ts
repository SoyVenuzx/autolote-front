export interface User {
  id: string
  email: string
  username: string
  isActive: boolean
  lastLogin: Date
  roles: string[]
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
}

export interface AuthResponse {
  message: string
  user: User & { token: string }
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  hasRole: (roles: string[]) => boolean
}
