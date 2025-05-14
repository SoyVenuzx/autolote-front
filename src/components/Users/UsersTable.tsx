import {
  PlusCircle,
  Pencil,
  Trash2,
  Mail,
  Calendar,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { capitalizeString, formatDate } from '@/lib/utils'
import { useAuthStore } from '@/hooks/useAuthStore'
import { useState } from 'react'
import { CreateUserModal } from './Modals/CreateUserModal'
import { DeleteUserModal } from './Modals/DeleteUserModal'

export default function UsersTable () {
  const { usersList } = useAuthStore()

  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const [actualUserId, setActualUserId] = useState<string | null>(null)

  if (!usersList) return null

  const handleDeleteUser = (userId: string) => {
    setActualUserId(userId)
    setOpenDeleteModal(true)
  }

  const handleUpdateUser = (userId: string) => {
    setActualUserId(userId)
    setOpenCreateModal(true)
  }

  return (
    <div className='min-h-screen p-6 bg-gray-50'>
      <div className='mx-auto max-w-7xl'>
        <div className='flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>
              Gestión de Usuarios
            </h1>
            <p className='mt-1 text-gray-500'>
              Administra los usuarios del sistema
            </p>
          </div>
        </div>

        <div className='overflow-hidden bg-white border border-gray-100 shadow-md rounded-xl'>
          <div className='p-6 border-b border-gray-100'>
            <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Lista de Usuarios
              </h2>

              <Button
                onClick={() => setOpenCreateModal(true)}
                size='default'
                className='transition-colors bg-blue-600 shadow-md hover:bg-blue-700'
              >
                <PlusCircle className='w-8 h-8' />
                Crear Usuario
              </Button>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-gray-50'>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[60px]'>
                    #
                  </th>
                  <th className='px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                    Usuario
                  </th>
                  <th className='px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                    Email
                  </th>
                  <th className='px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                    Estado
                  </th>
                  <th className='px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                    Último Acceso
                  </th>
                  <th className='px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                    Rol
                  </th>
                  <th className='px-6 py-4 text-xs font-medium tracking-wider text-right text-gray-500 uppercase'>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {usersList?.map((user, index) => (
                  <tr
                    key={user.id}
                    className='transition-colors hover:bg-gray-50'
                  >
                    <td className='px-6 py-4 text-sm font-medium text-center text-gray-500 whitespace-nowrap'>
                      {index + 1}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='ml-3'>
                          <div className='text-sm font-semibold text-gray-900'>
                            {capitalizeString(user.username)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center text-sm text-gray-600'>
                        <Mail className='w-4 h-4 mr-2 text-gray-400' />
                        {user.email}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {user.isActive ? (
                        <Badge className='text-green-800 bg-green-100 border-green-200 hover:bg-green-200'>
                          Activo
                        </Badge>
                      ) : (
                        <Badge
                          variant='outline'
                          className='text-gray-600 border-gray-300'
                        >
                          Inactivo
                        </Badge>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center text-sm text-gray-600'>
                        <Calendar className='w-4 h-4 mr-2 text-gray-400' />
                        {formatDate(user.lastLogin)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {user.roles.map(role => (
                        <div key={role.name} className='flex items-center'>
                          <Shield className='w-4 h-4 mr-2 text-gray-400' />
                          <span
                            className={`text-sm ${
                              role.name === 'admin'
                                ? 'text-purple-700 font-medium'
                                : 'text-gray-600'
                            }`}
                          >
                            {role.name === 'admin'
                              ? 'Administrador'
                              : 'Usuario'}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'>
                      <div className='flex justify-end gap-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleUpdateUser(user?.id)}
                          className='text-blue-700 transition-colors border-blue-200 hover:bg-blue-50 hover:text-blue-800'
                        >
                          <Pencil className='w-4 h-4 mr-1' />
                          Editar
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleDeleteUser(user.id)}
                          className='text-red-700 transition-colors border-red-200 hover:bg-red-50 hover:text-red-800'
                        >
                          <Trash2 className='w-4 h-4 mr-1' />
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='px-6 py-4 border-t border-gray-100 bg-gray-50'>
            <div className='flex items-center justify-between'>
              <p className='text-sm text-gray-500'>
                Mostrando {usersList.length} de {usersList.length} usuarios
              </p>
            </div>
          </div>
        </div>
      </div>

      <CreateUserModal
        isEditing={!!actualUserId}
        open={openCreateModal}
        onOpenChange={setOpenCreateModal}
        userId={actualUserId ?? null}
      />

      <DeleteUserModal
        isOpen={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
        userId={actualUserId}
      />
    </div>
  )
}
