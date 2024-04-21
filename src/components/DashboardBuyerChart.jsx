import React from 'react'
import { PieChart, Pie,Cell, ResponsiveContainer, Legend } from 'recharts'

const data=[
    {name: 'Homens', value:120},
    {name: 'Mulheres', value:350},
    {name:'Outros', value:45}
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function DashboardBuyerChart() {
  return (
    <div>
      <div className="w-[20rem] h-full bg-white p-4 rounded-sm flex flex-col">
        <div className="text-gray-600 font-sm pl-4 pb-4">
          <p>Perfil de compras</p>
        </div>
        <div className="w-full h-full ml-3 flex-1 text-sm">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={800} height={200} >
            <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
