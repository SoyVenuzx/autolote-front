import EmployeesTable from '@/components/Employees/EmployeesTable'
import { useEmployeeStore } from '@/hooks/useEmployeeStore'
import { useEffect } from 'react'

export default function EmpleadosPage () {
  const { getEmployees, getPuestos } = useEmployeeStore()

  useEffect(() => {
    async function fetchEmployeeData () {
      try {
        await getEmployees()
        await getPuestos()
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchEmployeeData()
  }, [getEmployees, getPuestos])

  return <EmployeesTable />
}
