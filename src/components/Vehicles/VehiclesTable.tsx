import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button' // Asume que tienes un componente Button
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table' // Asume componentes de tabla
import toast from 'react-hot-toast'

import { PlusCircle, Trash2 } from 'lucide-react'
import { useVehiculoStore } from '@/hooks/useVehicleStore'
import type { Vehiculo } from '@/store/types/vehicle.types'
import { Spinner } from '../ui/spinner'
import { DeleteVehiculoModal } from './Modals/DeleteVehicleModal'
import { CreateVehiculoModal } from './Modals/CreateVehicleModal'

export function VehiculosTable () {
  const {
    vehiculos,
    isLoadingVehiculos,
    errorVehiculos,
    getVehiculos
    // deleteVehiculo // Necesitarás esto para el modal de eliminación
  } = useVehiculoStore()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(
    null
  )

  useEffect(() => {
    getVehiculos()
  }, [getVehiculos])

  const handleOpenDeleteModal = (vehiculo: Vehiculo) => {
    // El ID del vehículo en tu JSON de respuesta es string, pero deleteVehiculo espera number.
    // Asegúrate de que el ID se maneje consistentemente como number si es posible en el backend/tipos.
    // Por ahora, parsearemos aquí, pero es mejor solucionarlo en el origen.
    const vehiculoWithNumericId = { ...vehiculo, id: parseInt(vehiculo.id, 10) }
    if (isNaN(vehiculoWithNumericId.id)) {
      toast.error('ID de vehículo inválido para eliminación.')
      return
    }
    setSelectedVehiculo(vehiculoWithNumericId as unknown as Vehiculo) // Temporal cast
    setIsDeleteModalOpen(true)
  }

  if (isLoadingVehiculos && !vehiculos) {
    ;<Spinner size={'medium'} />
  }

  if (errorVehiculos) {
    return (
      <p className='text-red-500'>
        Error al cargar vehículos: {errorVehiculos}
      </p>
    )
  }

  return (
    <div className='min-h-screen p-6 bg-gray-50'>
      <div className='mx-auto max-w-7xl'>
        <div className='container py-10 mx-auto'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-800'>
                Gestión de Vehiculos
              </h1>
              <p className='mt-1 text-gray-500'>
                Administra los vehiculos del sistema
              </p>
            </div>
          </div>

          <div className='overflow-hidden bg-white border border-gray-100 shadow-md rounded-xl'>
            <div className='p-6 border-b border-gray-100'>
              <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
                <h2 className='text-xl font-semibold text-gray-800'>
                  Lista de Vehiculos
                </h2>

                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  size='default'
                  className='transition-colors bg-blue-600 shadow-md hover:bg-blue-700'
                >
                  <PlusCircle className='w-8 h-8' />
                  Crear Vehiculo
                </Button>
              </div>
            </div>
            <div className='p-3'>
              {vehiculos && vehiculos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Año</TableHead>
                      <TableHead>VIN</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Precio Venta</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehiculos.map((vehiculo, index) => (
                      <TableRow
                        key={vehiculo.id}
                        className='transition-colors hover:bg-gray-50'
                      >
                        <TableCell className='text-sm font-medium text-gray-500 whitespace-nowrap'>
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          {vehiculo.modelo?.marca?.nombre || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {vehiculo.modelo?.nombre || 'N/A'}
                        </TableCell>
                        <TableCell>{vehiculo.anio}</TableCell>
                        <TableCell>{vehiculo.vin}</TableCell>
                        <TableCell>{vehiculo.color?.nombre || 'N/A'}</TableCell>
                        <TableCell>
                          {vehiculo.precio_venta_sugerido
                            ? `$${parseFloat(
                                vehiculo.precio_venta_sugerido
                              ).toFixed(2)}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>{vehiculo.estado_inventario}</TableCell>
                        <TableCell>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleOpenDeleteModal(vehiculo)}
                            title='Eliminar Vehículo'
                          >
                            <Trash2 className='w-4 h-4 text-red-500' />
                          </Button>
                          {/* Aquí podrías añadir un botón de "Ver detalles" o "Editar" en el futuro */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No hay vehículos para mostrar.</p>
              )}

              <div className='px-6 py-4 border-t border-gray-100 bg-gray-50'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm text-gray-500'>
                    Mostrando {vehiculos?.length} de {vehiculos?.length}{' '}
                    vehiculos
                  </p>
                </div>
              </div>

              <CreateVehiculoModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
              />

              {selectedVehiculo && (
                <DeleteVehiculoModal
                  isOpen={isDeleteModalOpen}
                  onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedVehiculo(null)
                  }}
                  vehiculo={selectedVehiculo}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
