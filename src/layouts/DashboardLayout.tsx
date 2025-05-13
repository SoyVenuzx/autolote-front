import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { AppSidebar } from '../components/AppSidebar'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'

export default function DashboardLayout () {
  const [user] = useState({
    name: 'Usuario Demo',
    email: 'usuario@ejemplo.com'
  })

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener('resize', checkIfMobile)

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <Navbar user={user} toggleSidebar={toggleSidebar} />

      <div className='flex flex-1 mt-16'>
        {/* Mobile sidebar */}
        {isMobile && (
          <div
            className={`fixed inset-0 z-40 transform ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out md:hidden`}
          >
            <div className='relative flex flex-col flex-1 w-full h-full max-w-xs pt-5 bg-white'>
              <div className='absolute top-0 right-0 pt-2 -mr-12'>
                <button
                  type='button'
                  className='flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                  onClick={toggleSidebar}
                >
                  <span className='sr-only'>Close sidebar</span>
                  <svg
                    className='w-6 h-6 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
              <AppSidebar />
            </div>
            <div className='flex-shrink-0 w-14 bg-red' aria-hidden='true'>
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        )}

        {/* Static sidebar for desktop */}
        <div className='hidden md:flex md:w-64 md:flex-col'>
          <AppSidebar />
        </div>

        {/* Main content */}
        <div className='flex flex-col flex-1'>
          <main className='flex-1 pb-8'>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-30 bg-gray-600 bg-opacity-75 md:hidden'
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
}
