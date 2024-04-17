import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function DashboardChart() {
  return (
    <div>
      <div className='w-full p-4 bg-white flex flex-col flex-1'>
        <div className="text-gray-600 font-sm pl-4 pb-4">
          <p>Saidas</p>
        </div>
        <BarChart width={800} height={200} data={dados}>
          <XAxis dataKey="name" stroke='#4b5563'/>
          <YAxis/>
          <Tooltip/>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 4"/>
          <Bar dataKey="uv" fill="#2563eb" barSize={50}/>
        </BarChart>
      </div>

        
    </div>
  )
}


const dados=[{name: 'Encomenda A', blue:0, uv: 500, pv: 2400, amt: 2400}, {name: 'Encomenda B',red:200, uv: 200, pv: 2400, amt: 2400}, {name: 'Encomenda C', blue:0, uv: 500, pv: 2400, amt: 2400}, {name: 'Encomenda D', red:0, uv: 300, pv: 2400, amt: 2400}, {name: 'Encomenda E',blue:0, uv: 300, pv: 2400, amt: 2400}]
