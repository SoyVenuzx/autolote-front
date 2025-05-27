import { SuppliersTable } from '@/components/Suppliers/SuppliersTable'
import { useSupplierStore } from '@/hooks/useSupplierStore'
import { useEffect } from 'react'

export default function ProveedoresPage () {
  const { getSuppliers } = useSupplierStore()

  useEffect(() => {
    async function fetchSupplierData () {
      try {
        await getSuppliers()
      } catch (error) {
        console.error('Error fetching suppliers.', error)
      }
    }
    fetchSupplierData()
  }, [getSuppliers])

  return <SuppliersTable />
}
