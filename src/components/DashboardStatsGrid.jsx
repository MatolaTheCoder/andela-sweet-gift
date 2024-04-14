import React from 'react'

export default function DashboardStatsGrid() {
  return (
    <>
      <div className='flex gap-2'>
        <GridWrapper>123</GridWrapper>
        <GridWrapper>123</GridWrapper>
        <GridWrapper>123</GridWrapper>
        <GridWrapper>123</GridWrapper>
      </div>
    </>
  )
}

function GridWrapper({children}){
  return <div className='bg-white p-4 flex-1 rounded shadow flex items-center'>{children}</div>
}