import StatsCard from './StatsCard'
import { Car, CreditCard, TrendingUp, Users } from 'lucide-react'

export default function StatsGrid () {
  const stats = [
    {
      title: 'Clientes Totales',
      value: 120,
      icon: <Users className='w-4 h-4 text-blue-600' />,
      description: '+5% desde el mes pasado'
    },
    {
      title: 'Vehículos en Inventario',
      value: 45,
      icon: <Car className='w-4 h-4 text-green-600' />,
      description: '-2% desde el mes pasado'
    },
    {
      title: 'Ventas del Mes',
      value: '$125,000',
      icon: <CreditCard className='w-4 h-4 text-purple-600' />,
      description: '+12% desde el mes pasado'
    },
    {
      title: 'Ingresos Totales',
      value: '$1.2M',
      icon: <TrendingUp className='w-4 h-4 text-red-600' />,
      description: '+8% desde el mes pasado'
    }
  ]

  return (
    <div className='grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  )
}
