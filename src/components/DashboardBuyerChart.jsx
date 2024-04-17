import React from 'react'
import { ResponsiveContainer } from 'recharts'

const data=[
    {name: 'Male', value:120},
    {name: 'female', value:650},
    {name:'others', value:5}
]

export default function DashboardBuyerChart() {
  return (
    <div>
      <div className="w-[20rem] bg-white p-4 rounded-sm flex flex-col flex-1">
        <div className="text-gray-600 font-sm pl-4 pb-4">
          <p>Perfil de compras</p>
        </div>
        <div className="w-full ml-3 flex-1 text-sm">
            <ResponsiveContainer width="100%" height="100%">
                
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
