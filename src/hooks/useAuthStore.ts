import { Store } from '@/store/store'

export const useAuthStore = () => {
  const user = Store(state => state.user)
  const isAuthenticated = Store(state => state.isAuthenticated)
  const isLoading = Store(state => state.isLoading)
  const hasRole = Store(state => state.hasRole)
  const login = Store(state => state.login)
  const register = Store(state => state.register)
  const logout = Store(state => state.logout)
  const refreshUser = Store(state => state.refreshUser)
  const clearError = Store(state => state.clearError)
  const error = Store(state => state.error)
  const checkCookies = Store(state => state.checkCookies)
  const checkAuth = Store(state => state.checkAuth)

  return {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    login,
    register,
    logout,
    refreshUser,
    clearError,
    error,
    checkCookies,
    checkAuth
  }
}
