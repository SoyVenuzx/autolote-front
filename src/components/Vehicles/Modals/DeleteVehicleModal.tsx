import { toast } from 'react-hot-toast'
import type { Vehiculo } from '@/store/types/vehicle.types'
import { useVehiculoStore } from '@/hooks/useVehicleStore'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

interface DeleteVehiculoModalProps {
  isOpen: boolean
  onClose: () => void
  vehiculo: Vehiculo | null // El vehículo a eliminar
}

export function DeleteVehiculoModal ({
  isOpen,
  onClose,
  vehiculo
}: DeleteVehiculoModalProps) {
  const { deleteVehiculo, isLoadingVehiculos } = useVehiculoStore()

  const handleDelete = async () => {
    if (!vehiculo || !vehiculo.id) {
      toast.error(
        'No se ha seleccionado ningún vehículo para eliminar o el ID es inválido.'
      )
      return
    }

    // El ID es string en el tipo Vehiculo, pero la función espera number
    const vehiculoIdAsNumber = parseInt(vehiculo.id, 10)
    if (isNaN(vehiculoIdAsNumber)) {
      toast.error('ID de vehículo inválido para eliminación.')
      return
    }

    const success = await deleteVehiculo(vehiculoIdAsNumber)
    if (success) {
      toast.success(
        `Vehículo ${vehiculo.modelo?.marca?.nombre} ${vehiculo.modelo?.nombre} (VIN: ${vehiculo.vin}) eliminado.`
      )
      onClose()
    }
    // El error ya se maneja y se muestra con toast desde el slice
  }

  if (!isOpen || !vehiculo) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar el vehículo: <br />
            <div className='py-2'>
              <strong>
                {vehiculo.modelo?.marca?.nombre} {vehiculo.modelo?.nombre}
              </strong>{' '}
              <br />
              VIN: <strong>{vehiculo.vin}</strong>?
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className='bg-red-600'
            onClick={handleDelete}
            disabled={isLoadingVehiculos}
          >
            {isLoadingVehiculos ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
