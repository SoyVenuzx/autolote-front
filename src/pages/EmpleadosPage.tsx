import EmployeesTable from '@/components/Employees/EmployeesTable'
import { useEmployeeStore } from '@/hooks/useEmployeeStore'
import { useEffect } from 'react'

export default function EmpleadosPage () {
  const { getEmployees, getContactos, getPuestos } = useEmployeeStore()

  useEffect(() => {
    async function fetchUsers () {
      try {
        await getEmployees()
        await getContactos()
        await getPuestos()
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [getEmployees, getPuestos, getContactos])

  return <EmployeesTable />
}
