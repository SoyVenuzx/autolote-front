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
import { useEmployeeStore } from '@/hooks/useEmployeeStore'

type DeleteUserModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  employeeId: number | null
}

export function DeleteEmployeeModal ({
  isOpen,
  onOpenChange,
  employeeId
}: DeleteUserModalProps) {
  const { deleteEmployee, error } = useEmployeeStore()

  const handleDeleteEmployee = async () => {
    if (!employeeId) return

    console.log('Deleting user with ID:', employeeId)

    await deleteEmployee(employeeId)

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
          <AlertDialogAction onClick={handleDeleteEmployee}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
