import { LogOut, Menu, Settings, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from './ui/button'
import { useAuthStore } from '@/hooks/useAuthStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { capitalizeFirstLetter } from '@/lib/utils'

interface NavbarProps {
  user: {
    name: string
    email: string
  }
  toggleSidebar: () => void
}

export function Navbar ({ toggleSidebar }: NavbarProps) {
  const { user, logout, error } = useAuthStore()

  if (!user) return null

  const navigate = useNavigate()
  const initials = user.username
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  const handleLogout = async () => {
    await logout()

    if (!error) navigate('/login')
  }

  const AvatarIcon = () => (
    <div className='flex items-center justify-center w-10 h-10 text-sm font-medium text-white bg-gray-900 rounded-full'>
      {initials}
    </div>
  )

  return (
    <header className='fixed top-0 z-50 w-full bg-white border-b border-gray-200'>
      <div className='flex items-center justify-between h-16 px-4'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={toggleSidebar}
          >
            <Menu className='w-5 h-5' />
            <span className='sr-only'>Toggle sidebar</span>
          </Button>
          <Link to='/dashboard' className='flex items-center gap-2'>
            <div className='flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-md'>
              <span className='text-sm font-bold'>AG</span>
            </div>
            <span className='text-xl font-bold text-gray-900'>AutoGestión</span>
          </Link>
        </div>
        <div className='flex items-center gap-4'>
          <h3 className='flex items-center gap-1 text-sm text-center'>
            ¡Bienvenido,{' '}
            <span className='font-bold'>
              {capitalizeFirstLetter(user.username)}
            </span>{' '}
            👋
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='relative w-10 h-10 p-0 overflow-hidden rounded-full'
              >
                <AvatarIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <div className='flex items-center justify-start gap-2 p-2'>
                <AvatarIcon />
                <div className='flex flex-col space-y-1 leading-none'>
                  <p className='font-medium'>{user.username}</p>
                  <p className='text-xs text-gray-500'>{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='cursor-pointer'>
                <User className='w-4 h-4 mr-2' />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer'>
                <Settings className='w-4 h-4 mr-2' />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className='cursor-pointer'
              >
                <LogOut className='w-4 h-4 mr-2' />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
