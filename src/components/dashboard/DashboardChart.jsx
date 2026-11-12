import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const dados = [
  { name: 'Encomenda A', uv: 500 },
  { name: 'Encomenda B', uv: 200 },
  { name: 'Encomenda C', uv: 500 },
  { name: 'Encomenda D', uv: 300 },
  { name: 'Encomenda E', uv: 300 },
];

export default function DashboardChart() {
  return (
    <div className="card flex h-full flex-col p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-neutral-800">Vendas por encomenda</h2>
        <p className="text-xs text-neutral-500">Valores de exemplo (MZN).</p>
      </div>
      <div className="h-64 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#e5e5e5" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#a3a3a3" tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} stroke="#a3a3a3" tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: '#f5f3ff' }}
              contentStyle={{ borderRadius: 8, borderColor: '#e5e5e5', fontSize: 12 }}
            />
            <Bar dataKey="uv" fill="#6b21a8" radius={[6, 6, 0, 0]} maxBarSize={56} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
