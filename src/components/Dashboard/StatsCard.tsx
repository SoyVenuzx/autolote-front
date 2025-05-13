import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  description: string
}

export default function StatsCard ({
  title,
  value,
  icon,
  description
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-gray-500'>{description}</p>
      </CardContent>
    </Card>
  )
}
