import StatsGrid from '@/components/Dashboard/StatsGrid'
import HeroSection from '@/components/Dashboard/HeroSection'
import RecentSales from '@/components/Dashboard/RecentSales'

export default function DashboardPage () {
  return (
    <div className='px-4 py-6 sm:px-6 lg:px-8'>
      <HeroSection />
      <StatsGrid />
      <RecentSales />
    </div>
  )
}
