import React from 'react'
import DashboardStatsGrid from './DashboardStatsGrid'
import DashboardChart from './DashboardChart'

export default function Dashboard() {
  return (
    <div className='flex flex-col gap-4'>
      <DashboardStatsGrid/>
      <div className="flex flex-row gap-4">
        <DashboardChart/>
      </div>
      
    </div>
  )
}
