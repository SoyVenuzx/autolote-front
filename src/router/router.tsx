import { NotFoundPage } from '@/components/NotFoundPage'
import DashboardLayout from '@/layouts/DashboardLayout'
import ClientesPage from '@/pages/ClientesPage'
import DashboardPage from '@/pages/DashboardPage'
import EmpleadosPage from '@/pages/EmpleadosPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import UsuariosPage from '@/pages/UsuariosPage'
import VehiculosPage from '@/pages/VehiculosPage'
import VentasPage from '@/pages/VentasPage'
import { createBrowserRouter, Navigate } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: <Navigate to='/dashboard' replace />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/signup',
        element: <SignupPage />
      },
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />
          },
          {
            path: 'clientes',
            element: <ClientesPage />
          },
          {
            path: 'vehiculos',
            element: <VehiculosPage />
          },
          {
            path: 'usuarios',
            element: <UsuariosPage />
          },
          {
            path: 'empleados',
            element: <EmpleadosPage />
          },
          {
            path: 'ventas',
            element: <VentasPage />
          }
        ]
      }
    ]
  }
])
