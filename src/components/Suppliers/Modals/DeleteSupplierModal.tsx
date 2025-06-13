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
import { useSupplierStore } from '@/hooks/useSupplierStore'

type DeleteSupplierModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  supplierId: number | null
}

export function DeleteSupplierModal ({
  isOpen,
  onOpenChange,
  supplierId
}: DeleteSupplierModalProps) {
  const { deleteSupplier, error } = useSupplierStore()

  const handleDeleteSupplier = async () => {
    if (!supplierId) return
    console.log('Deleting supplier with ID:', supplierId)

    await deleteSupplier(supplierId.toString())

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
            onClick={handleDeleteSupplier}
            className='bg-red-600'
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
