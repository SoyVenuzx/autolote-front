import { Car } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card'

export default function RecentSales () {
  const sales = [1, 2, 3, 4, 5]

  return (
    <div className='grid gap-6 md:grid-cols-1'>
      <Card>
        <CardHeader>
          <CardTitle>Ventas Recientes</CardTitle>
          <CardDescription>Las últimas 5 ventas realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {sales.map(i => (
              <div
                key={i}
                className='flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0'
              >
                <div className='flex items-center space-x-3'>
                  <div className='flex items-center justify-center rounded-full h-9 w-9 bg-blue-50'>
                    <Car className='w-5 h-5 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>
                      Toyota Corolla {2020 + i}
                    </p>
                    <p className='text-xs text-gray-500'>Cliente: Juan Pérez</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-medium'>
                    ${(15000 + i * 1000).toLocaleString()}
                  </p>
                  <p className='text-xs text-gray-500'>
                    Hace {i} día{i > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
