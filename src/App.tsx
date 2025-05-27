import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import ClientesPage from './pages/ClientesPage'
import VehiculosPage from './pages/VehiculosPage'
import UsuariosPage from './pages/UsuariosPage'
import EmpleadosPage from './pages/EmpleadosPage'
import VentasPage from './pages/VentasPage'
import ProtectedRoute from './components/SafeRoutes/ProtectedRoute'
import { NotFoundPage } from './components/NotFoundPage'
import { useEffect } from 'react'
import { useGlobalStore } from './hooks/useGlobalStore'
import ProveedoresPage from './pages/ProveedoresPage'

function App () {
  const { getContactos } = useGlobalStore()

  useEffect(() => {
    async function fetchContactos () {
      try {
        await getContactos()
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchContactos()
  }, [getContactos])

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />

      {/* Rutas protegidas */}
      <Route
        path='/dashboard/*'
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Estas rutas se resolverán como /dashboard, /dashboard/clients, etc. */}
        <Route index element={<DashboardPage />} />
        <Route path='clients' element={<ClientesPage />} />
        <Route path='vehicles' element={<VehiculosPage />} />
        <Route path='users' element={<UsuariosPage />} />
        <Route path='employees' element={<EmpleadosPage />} />
        <Route path='suppliers' element={<ProveedoresPage />} />
        <Route path='sales' element={<VentasPage />} />
      </Route>

      <Route path='/' element={<Navigate to='/dashboard' replace />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
