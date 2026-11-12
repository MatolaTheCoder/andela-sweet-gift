import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Homens', value: 120 },
  { name: 'Mulheres', value: 350 },
  { name: 'Outros', value: 45 },
];

const COLORS = ['#6b21a8', '#0ea5e9', '#f59e0b', '#f43f5e'];

export default function DashboardBuyerChart() {
  return (
    <div className="card flex h-full flex-col p-4 sm:p-5">
      <div className="mb-2">
        <h2 className="text-sm font-semibold text-neutral-800">Perfil de compras</h2>
        <p className="text-xs text-neutral-500">Distribuição de exemplo por género.</p>
      </div>
      <div className="h-64 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 8, borderColor: '#e5e5e5', fontSize: 12 }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
