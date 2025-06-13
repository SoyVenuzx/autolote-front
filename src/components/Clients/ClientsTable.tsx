import { useClientStore } from '@/hooks/useClientStore'
import { Building, Mail, Pencil, PlusCircle, Trash2 } from 'lucide-react'
import { Badge } from '../ui/badge'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { capitalizeString } from '@/lib/utils'
import { DeleteClientModal } from './Modals/DeleteClientModal'
import { CreateClientModal } from './Modals/CreateClientModal'

export default function ClientsTable () {
  const { clients } = useClientStore()

  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [actualUserId, setActualUserId] = useState<number | null>(null)

  if (!clients) return null

  const handleOpenChange = (open: boolean) => {
    if (actualUserId) setActualUserId(null)

    setOpenCreateModal(open)
  }

  const handleDeleteClient = async (id: number) => {
    setActualUserId(id)
    setOpenDeleteModal(true)
  }

  const handleUpdateUser = (id: number | null) => {
    setActualUserId(id)
    setOpenCreateModal(true)
  }

  return (
    <div className='min-h-screen p-6 bg-gray-50'>
      <div className='mx-auto max-w-7xl'>
        <div className='flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>
              Gestión de Clientes
            </h1>
            <p className='mt-1 text-gray-500'>
              Administra los clients del sistema
            </p>
          </div>
        </div>

        <div className='overflow-hidden bg-white border border-gray-100 shadow-md rounded-xl'>
          <div className='p-6 border-b border-gray-100'>
            <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Lista de Clients
              </h2>

              <Button
                onClick={() => setOpenCreateModal(true)}
                size='default'
                className='transition-colors bg-blue-600 shadow-md hover:bg-blue-700'
              >
                <PlusCircle className='w-8 h-8' />
                Crear Cliente
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
                    Nombre Completo
                  </th>
                  <th className='px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                    Email
                  </th>
                  <th className='px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                    Nota
                  </th>
                  <th className='px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                    Empresa
                  </th>
                  <th className='px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                    Activo
                  </th>
                  <th className='px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {clients?.map((client, index) => (
                  <tr
                    key={client.id}
                    className='transition-colors hover:bg-gray-50'
                  >
                    <td className='px-6 py-4 text-sm font-medium text-center text-gray-500 whitespace-nowrap'>
                      {index + 1}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='ml-3'>
                          <div className='text-sm font-semibold text-gray-900'>
                            {capitalizeString(client.contacto.nombre_completo)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center text-sm text-gray-600'>
                        <Mail className='w-4 h-4 mr-2 text-gray-400' />
                        {client.contacto.email}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center text-sm text-gray-600'>
                        <Mail className='w-4 h-4 mr-2 text-gray-400' />
                        {client.notas_cliente}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center text-sm text-gray-600'>
                        <Building className='w-4 h-4 mr-2 text-gray-400' />
                        {capitalizeString(
                          client.contacto.nombre_empresa?.trim().toString()!
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {client.activo ? (
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
                    <td className='px-6 py-4 text-sm font-medium text-left whitespace-nowrap'>
                      <div className='flex justify-start gap-3'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleUpdateUser(parseInt(client?.id))}
                          className='text-blue-700 transition-colors border-blue-200 hover:bg-blue-50 hover:text-blue-800'
                        >
                          <Pencil className='w-4 h-4 mr-1' />
                          Editar
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            handleDeleteClient(parseInt(client?.id))
                          }
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
                Mostrando {clients.length} de {clients.length} clientes
              </p>
            </div>
          </div>
        </div>
      </div>

      <CreateClientModal
        isEditing={!!actualUserId}
        open={openCreateModal}
        onOpenChange={handleOpenChange}
        clientId={actualUserId ?? null}
      />

      <DeleteClientModal
        employeeId={actualUserId ?? null}
        isOpen={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
      />
    </div>
  )
}
