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
import { useAuthStore } from '@/hooks/useAuthStore'

type DeleteUserModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
}

export function DeleteUserModal ({
  isOpen,
  onOpenChange,
  userId
}: DeleteUserModalProps) {
  const { deleteUser, error } = useAuthStore()

  const handleDeleteUser = async () => {
    if (!userId) return

    console.log('Deleting user with ID:', userId)

    await deleteUser(userId)

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
          <AlertDialogAction onClick={handleDeleteUser}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
