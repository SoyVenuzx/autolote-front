import type {
  AuthResponse,
  LoginCredentials,
  RegisterData
} from '@/types/auth.types'
import { api } from './axios'

const authApi = {
  /**
   **  Inicia sesión con email y contraseña
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials)

    return response.data
  },

  /**
   ** Registra un nuevo usuario
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data)

    return response.data
  },

  /**
   ** Cierra sesión del usuario
   */
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/logout')

    return response.data
  },

  /**
   ** Obtiene el perfil del usuario autenticado
   */
  getProfile: async (): Promise<{
    message: string
    user: AuthResponse['user']
  }> => {
    const response = await api.get<{
      message: string
      user: AuthResponse['user']
    }>('/auth/profile', { withCredentials: true })

    return response.data
  }
}

export default authApi
