import React, { type ReactElement } from 'react'
import { useAuthStore } from '@/hooks/useAuthStore'

interface ProtectedComponentProps {
  requiredRoles?: string[]
  fallback?: ReactElement | null
  children: React.ReactNode
}

/**
 * HOC para proteger componentes individuales basado en autenticación y roles
 *
 * @param requiredRoles - Array de roles permitidos para ver el componente
 * @param fallback - Componente a mostrar si el usuario no tiene permisos
 * @param children - Componente a proteger
 */
const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  requiredRoles = [],
  fallback = null,
  children
}) => {
  const { isLoading, hasRole } = useAuthStore()

  // No mostrar nada mientras verificamos la autenticación
  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className='w-6 h-6 border-t-2 border-b-2 rounded-full animate-spin border-primary'></div>
      </div>
    )
  }

  // Verificar roles solo si hay roles requeridos y el usuario está autenticado
  if (requiredRoles.length > 0) {
    // Verificar si tiene alguno de los roles requeridos
    const userHasRequiredRole = hasRole(requiredRoles)

    if (!userHasRequiredRole) {
      console.debug('Acceso denegado - Roles requeridos:', requiredRoles)
      return fallback
    }
  }

  // Permitir acceso al componente protegido
  return <>{children}</>
}

/**
 * HOC para proteger componentes con un enfoque funcional
 *
 * @param Component - Componente a proteger
 * @param options - Opciones de protección (roles requeridos y fallback)
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedComponentProps, 'children'> = {}
) => {
  const WithAuthComponent = (props: P) => (
    <ProtectedComponent {...options}>
      <Component {...props} />
    </ProtectedComponent>
  )

  // Mantener el nombre del componente para depuración
  WithAuthComponent.displayName = `withAuth(${
    Component.displayName || Component.name
  })`

  return WithAuthComponent
}

export default ProtectedComponent
