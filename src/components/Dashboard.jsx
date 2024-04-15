import React from 'react'
import DashboardStatsGrid from './DashboardStatsGrid'
import DashboardChart from './DashboardChart'

export default function Dashboard() {
  return (
    <div>
      <DashboardStatsGrid/>
      <DashboardChart/>
    </div>
  )
}
