import UsersTable from '@/components/Users/UsersTable'
import { useAuthStore } from '@/hooks/useAuthStore'
import { useEffect } from 'react'

export default function UsuariosPage () {
  const { getUsers } = useAuthStore()

  useEffect(() => {
    async function fetchUsers () {
      try {
        await getUsers()
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [getUsers])

  return <UsersTable />
}
