import { Car, CreditCard, Home, Users } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import ProtectedComponent from '@/components/SafeRoutes/ProtectedComponent'

export function AppSidebar () {
  const location = useLocation()
  const pathname = location.pathname

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/dashboard'
    },
    {
      title: 'Vehículos',
      icon: Car,
      href: '/dashboard/vehicles'
    },
    {
      title: 'Clientes',
      icon: Users,
      href: '/dashboard/clients'
    },
    {
      title: 'Proveedores',
      icon: Users,
      href: '/dashboard/suppliers'
    },
    {
      title: 'Usuarios',
      icon: Users,
      href: '/dashboard/users',
      roles: ['ROLE_ADMIN'] // Solo visible para administradores
    },
    {
      title: 'Empleados',
      icon: Users,
      href: '/dashboard/employees',
      roles: ['ROLE_ADMIN']
    },
    {
      title: 'Ventas',
      icon: CreditCard,
      href: '/dashboard/sales'
    }
  ]

  return (
    <aside className='h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white lg:block'>
      <div className='flex flex-col h-full'>
        <div className='flex-1 py-4 overflow-y-auto'>
          <nav className='px-2 mt-2'>
            <div className='space-y-1'>
              {menuItems.map(item => {
                const isActive = pathname === item.href

                // Si el elemento tiene roles, envuélvelo con ProtectedComponent
                const menuItem = (
                  <Link
                    key={item.title}
                    to={item.href}
                    className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive
                          ? 'text-blue-600'
                          : 'text-gray-500 group-hover:text-gray-600'
                      }`}
                    />
                    {item.title}
                  </Link>
                )

                return item.roles ? (
                  <ProtectedComponent
                    key={item.title}
                    requiredRoles={item.roles}
                  >
                    {menuItem}
                  </ProtectedComponent>
                ) : (
                  menuItem
                )
              })}
            </div>
          </nav>
        </div>
      </div>
    </aside>
  )
}
