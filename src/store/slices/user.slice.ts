import { type StateCreator } from 'zustand'
import authApi from '@/api/auth.api'
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData
} from '@/types/auth.types'
import type { UserSliceType } from '../types/user.types'
import { api } from '@/api/axios'
import toast from 'react-hot-toast'
import type {
  CreateUserType,
  UpdateUserType
} from '@/schemas/createUser.schema'
import type { TableUser } from '@/types/users.type'

export const createUserSlice: StateCreator<UserSliceType> = (set, get) => {
  // Verificar autenticación al inicializar
  const checkAuthStatus = async () => {
    set({ isLoading: true, error: null })

    try {
      // Intentar obtener el perfil del usuario para verificar si está autenticado
      const response = await api.get<{
        message: string
        user: AuthResponse['user']
      }>('/auth/profile')

      const { user } = response.data

      // Guardar información del usuario
      set({
        isLoading: false,
        isAuthenticated: true,
        user,
        error: null
      })

      // Log de éxito para depuración
      console.log('Usuario autenticado:', user)

      return user
    } catch (error: any) {
      // Manejo detallado de errores para depuración
      console.error(
        'Error al verificar autenticación:',
        error.response?.status,
        error.response?.data || error.message
      )

      // Si hay un error, asumimos que no hay sesión activa
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        // error: error.response?.data?.message || 'Error de autenticación'
        error: null
      })

      return null
    }
  }

  // Iniciar el chequeo de autenticación
  if (typeof window !== undefined) {
    checkAuthStatus()
  }

  // Configurar el listener para errores de autenticación
  if (typeof window !== 'undefined') {
    console.log('Evento auth:error detectado, cerrando sesión')

    window.addEventListener('auth:error', () => {
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null
      })
    })
  }

  return {
    // Estado
    users: [],
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    // Acciones
    login: async (credentials: LoginCredentials) => {
      set({ isLoading: true, error: null })

      try {
        const { user } = await authApi.login(credentials)

        toast.success('Inicio de sesión exitoso')

        set({
          isLoading: false,
          isAuthenticated: true,
          user,
          error: null
        })
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Error al iniciar sesión'

        toast.error(errorMessage)
        set({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: errorMessage
        })

        throw error
      }
    },

    register: async (data: RegisterData) => {
      set({ isLoading: true, error: null })

      try {
        const { message } = await authApi.register(data)

        console.log({ message })

        // Después del registro, hacemos login automáticamente
        const { login } = get()
        await login({ email: data.email, password: data.password })

        toast.success('Registro exitoso')
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Error al registrarse'

        toast.error(errorMessage)

        set({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: errorMessage
        })

        throw error
      }
    },

    refreshUser: async () => {
      const { isAuthenticated } = get()
      if (!isAuthenticated) return

      try {
        const { user } = await authApi.getProfile()

        console.log({ user })

        set({
          user,
          error: null
        })
      } catch (error) {
        console.error('Error al actualizar información del usuario:')
      }
    },

    logout: async () => {
      try {
        await authApi.logout()
      } catch (error) {
        console.error('Error al cerrar sesión en el servidor:', error)
      } finally {
        set({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: null
        })
      }
    },

    clearError: () => {
      set({ error: null })
    },

    hasRole: (requiredRoles: string[] = []) => {
      const { user } = get()

      if (!user || !user.roles || requiredRoles.length === 0) {
        return false
      }

      // Verificar si el usuario tiene alguno de los roles requeridos
      const payload = user.roles.some(
        role =>
          requiredRoles.includes(role) ||
          requiredRoles.includes(`ROLE_${role?.toUpperCase() as string}`)
      )

      return payload
    },

    checkCookies: () => {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=')
        return { ...acc, [name]: value }
      }, {})

      console.log('Cookies disponibles:', cookies)

      return cookies
    },

    checkAuth: checkAuthStatus(),

    getUsers: async () => {
      try {
        const { data } = await api.get('/admin/get-users')

        set({ users: data?.data })
      } catch (error) {
        console.error('Error al obtener usuarios:', error)
        toast.error('Error al obtener usuarios')
      }
    },

    getUserById: async (userId: string) => {
      try {
        if (!userId) return

        const { data } = await api.get(`/admin/get-user/${userId}`)
        console.log('Usuario obtenido:', data)

        return data?.user
      } catch (error) {
        console.error('Error al obtener usuario:', error)
        toast.error('Error al obtener usuario')
      }
    },

    createUser: async (formData: CreateUserType) => {
      set({ isLoading: true, error: null })
      try {
        const { data } = await api.post<{ message: string; data: TableUser[] }>(
          '/admin/create-user',
          formData
        )

        set({ isLoading: false, users: data?.data })
        toast.success('Registro exitoso')
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Error al registrarse'

        toast.error(errorMessage)

        set({
          isLoading: false,
          error: errorMessage
        })

        throw error
      }
    },

    deleteUser: async (userId: string) => {
      try {
        set({ isLoading: true, error: null })

        const { data } = await api.delete(`/admin/delete-user/${userId}`)

        set({ isLoading: false, users: data?.data })
        toast.success('Usuario eliminado exitosamente')
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Error al eliminar usuario'

        toast.error(errorMessage)

        set({
          isLoading: false,
          error: errorMessage
        })

        throw error
      }
    },
    updateUser: async (userId: string, dataForm: UpdateUserType) => {
      set({ isLoading: true, error: null })
      try {
        const { data } = await api.put<{ message: string; data: TableUser[] }>(
          `/admin/update-user/${userId}`,
          dataForm
        )

        set({ isLoading: false, users: data?.data })
        toast.success('Usuario actualizado exitosamente')
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Error al actualizar usuario'

        toast.error(errorMessage)

        set({
          isLoading: false,
          error: errorMessage
        })

        throw error
      }
    }
  }
}
