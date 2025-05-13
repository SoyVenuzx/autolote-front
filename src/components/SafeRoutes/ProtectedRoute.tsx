import React, { useEffect } from 'react'
import { useNavigate, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/hooks/useAuthStore'
import authApi from '@/api/auth.api'

interface ProtectedRouteProps {
  requiredRoles?: string[]
  redirectPath?: string
  children?: React.ReactNode
}

/**
 * Componente para proteger rutas basado en autenticación y roles
 *
 * @param requiredRoles - Array de roles permitidos para acceder a la ruta
 * @param redirectPath - Ruta a la que redirigir si no tiene permisos
 * @param children - Componentes hijos a renderizar si tiene permisos
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRoles = [],
  redirectPath = '/login',
  children
}) => {
  const { isAuthenticated, isLoading, hasRole, refreshUser } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Verificar la sesión al cargar el componente
  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      if (!isLoading && isAuthenticated) {
        try {
          // Refrescar información del usuario si ya está autenticado
          await refreshUser()
        } catch (error) {
          console.error('Error al refrescar usuario:', error)
          // Solo redirigir si el componente sigue montado
          if (isMounted) {
            // Si falla al refrescar, puede ser que el token ha expirado
            navigate(redirectPath, { replace: true, state: { from: location } })
          }
        }
      }
    }

    checkAuth()

    // Cleanup function para evitar actualizar estado en componentes desmontados
    return () => {
      isMounted = false
    }
  }, [
    isAuthenticated,
    isLoading,
    refreshUser,
    navigate,
    redirectPath,
    location
  ])

  useEffect(() => {
    // Manejador para errores de autenticación
    const handleAuthError = () => {
      console.warn('Se detectó un error de autenticación, redirigiendo...')
      navigate(redirectPath, { replace: true, state: { from: location } })
    }

    // Suscribirse al evento auth:error
    window.addEventListener('auth:error', handleAuthError)

    // Limpieza al desmontar
    return () => {
      window.removeEventListener('auth:error', handleAuthError)
    }
  }, [navigate, redirectPath, location])

  // Mostrar un indicador de carga mientras verificamos el estado de autenticación
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='w-10 h-10 border-t-2 border-b-2 rounded-full animate-spin border-primary'></div>
      </div>
    )
  }

  // Si no está autenticado, redirigir al login preservando la ruta original
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  // Verificar permisos de rol si se especificaron
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    // El usuario está autenticado pero no tiene los roles necesarios
    // Redirigir a una página de acceso denegado o dashboard
    return <Navigate to='/forbidden' replace />
  }

  // Permitir acceso al componente protegido
  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
