import { useEmployeeStore } from '@/hooks/useEmployeeStore'
import { Button } from '../ui/button'
import { Calendar, Mail, Pencil, PlusCircle, Trash2 } from 'lucide-react'
import { capitalizeString, formatDate } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { CreateEmpleadoModal } from './Modals/CreateEmployeeModal'
import { useState } from 'react'
import { DeleteEmployeeModal } from './Modals/DeleteEmployeeModal'

export default function EmployeesTable () {
  const { employees } = useEmployeeStore()

  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [actualUserId, setActualUserId] = useState<number | null>(null)

  if (!employees) return null

  const handleOpenChange = (open: boolean) => {
    if (actualUserId) setActualUserId(null)

    setOpenCreateModal(open)
  }

  const handleUpdateEmployee = (employeeId: number | null) => {
    setActualUserId(employeeId)
    setOpenCreateModal(true)
  }

  const handleDeleteEmployee = async (id: number) => {
    setActualUserId(id)
    setOpenDeleteModal(true)
  }

  return (
    <div className='min-h-screen p-6 bg-gray-50'>
      <div className='mx-auto max-w-7xl'>
        <div className='flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>
              Gestión de Empleados
            </h1>
            <p className='mt-1 text-gray-500'>
              Administra los empleados del sistema
            </p>
          </div>
        </div>

        <div className='overflow-hidden bg-white border border-gray-100 shadow-md rounded-xl'>
          <div className='p-6 border-b border-gray-100'>
            <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Lista de Empleados
              </h2>

              <Button
                onClick={() => setOpenCreateModal(true)}
                size='default'
                className='transition-colors bg-blue-600 shadow-md hover:bg-blue-700'
              >
                <PlusCircle className='w-8 h-8' />
                Crear Empleado
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
                    Activo
                  </th>
                  {/* <th className='px-6 py-4 text-xs font-medium tracking-wider text-right text-gray-500 uppercase'>
                    DNI
                  </th> */}
                  <th className='px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                    Puesto
                  </th>
                  <th className='px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                    Fecha de Contratación
                  </th>
                  <th className='px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {employees?.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className='transition-colors hover:bg-gray-50'
                  >
                    <td className='px-6 py-4 text-sm font-medium text-center text-gray-500 whitespace-nowrap'>
                      {index + 1}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='ml-3'>
                          <div className='text-sm font-semibold text-gray-900'>
                            {capitalizeString(
                              employee.contacto.nombre_completo
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center text-sm text-gray-600'>
                        <Mail className='w-4 h-4 mr-2 text-gray-400' />
                        {employee.contacto.email}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {employee.activo ? (
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
                    <td className='px-5 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='text-sm font-semibold text-gray-900'>
                          {capitalizeString(employee.puesto.nombre_puesto)}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center text-sm text-gray-600'>
                        <Calendar className='w-4 h-4 mr-2 text-gray-400' />
                        {formatDate(employee.fecha_contratacion.toString())}
                      </div>
                    </td>
                    <td className='px-6 py-4 text-sm font-medium text-left whitespace-nowrap'>
                      <div className='flex justify-start gap-3'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            handleUpdateEmployee(parseInt(employee?.id))
                          }
                          className='text-blue-700 transition-colors border-blue-200 hover:bg-blue-50 hover:text-blue-800'
                        >
                          <Pencil className='w-4 h-4 mr-1' />
                          Editar
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            handleDeleteEmployee(parseInt(employee?.id))
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
                Mostrando {employees.length} de {employees.length} empleados
              </p>
            </div>
          </div>
        </div>
      </div>

      <CreateEmpleadoModal
        isEditing={!!actualUserId}
        open={openCreateModal}
        onOpenChange={handleOpenChange}
        empleadoId={actualUserId ?? null}
      />
      <DeleteEmployeeModal
        employeeId={actualUserId ?? null}
        isOpen={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
      />
    </div>
  )
}
