import ClientsTable from '@/components/Clients/ClientsTable'
import { useClientStore } from '@/hooks/useClientStore'
import { useEffect } from 'react'

export default function ClientesPage () {
  const { getClients } = useClientStore()

  useEffect(() => {
    async function fetchClients () {
      try {
        await getClients()
      } catch (error) {
        console.error('Error fetching clients:', error)
      }
    }

    fetchClients()
  }, [getClients])

  return <ClientsTable />
}
