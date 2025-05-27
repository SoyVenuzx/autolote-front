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
import { useClientStore } from '@/hooks/useClientStore'

type DeleteClientModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  employeeId: number | null
}

export function DeleteClientModal ({
  isOpen,
  onOpenChange,
  employeeId
}: DeleteClientModalProps) {
  const { error, deleteClient } = useClientStore()

  const handleDeleteClient = async () => {
    if (!employeeId) return

    console.log('Deleting user with ID:', employeeId)

    await deleteClient(employeeId)

    if (!error) onOpenChange(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto borrará permanentemente este
            campo y eliminará los datos de nuestros servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteClient}
            className='bg-red-600'
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
