import { Home, LogOut, LucideBatteryLow } from 'lucide-react'
import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <main className='flex flex-col min-h-screen'>
      <div className='flex items-center justify-center flex-grow px-4'>
        <div className='w-full max-w-md text-center'>
          <div className='relative mb-6'>
            <div className='relative w-32 h-32 mx-auto'>
              <div className='absolute inset-0 bg-blue-600 rounded-full opacity-10 animate-pulse'></div>
              <div className='relative z-10 flex items-center justify-center h-full'>
                {/* Icon */}
                <LucideBatteryLow className='w-16 h-16 text-black' />

                <div className='absolute flex items-center justify-center w-12 h-12 text-xl font-bold text-white bg-blue-600 rounded-full -top-4 -right-4'>
                  404
                </div>
              </div>
            </div>
          </div>

          <h1 className='mb-2 text-4xl font-bold'>
            ¡Ups! Página no encontrada
          </h1>

          <p className='mb-8 text-gray-600'>
            Parece que esta página no existe o ha sido movida. No te preocupes,
            ¡aquí hay algunas opciones para que sigas disfrutando de tu
            experiencia!
          </p>

          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Link
              to='/dashboard'
              className='flex items-center justify-center gap-2 px-6 py-3 text-white transition-colors bg-blue-500 rounded-lg shadow-md hover:bg-bluee-600'
            >
              <Home className='w-5 h-5' />
              Volver al inicio
            </Link>

            <Link
              to='/'
              className='flex items-center justify-center gap-2 px-6 py-3 text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50'
            >
              <LogOut className='w-5 h-5' />
              Cerrar Sesión
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
