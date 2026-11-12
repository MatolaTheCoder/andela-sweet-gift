import React from 'react';
import {
  HiOutlineCash,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineUsers,
} from 'react-icons/hi';
import { formatCurrency, formatNumber } from '../../lib/format';

export default function DashboardStatsGrid({ stats = {}, loading = false }) {
  const items = [
    {
      key: 'orders',
      label: 'Encomendas',
      value: formatNumber(stats.orders ?? 0),
      icon: HiOutlineShoppingCart,
      tone: 'bg-sky-50 text-sky-600',
    },
    {
      key: 'products',
      label: 'Produtos',
      value: formatNumber(stats.products ?? 0),
      icon: HiOutlineCube,
      tone: 'bg-purple-50 text-purple-600',
    },
    {
      key: 'clients',
      label: 'Clientes',
      value: formatNumber(stats.clients ?? 0),
      icon: HiOutlineUsers,
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      key: 'revenue',
      label: 'Valor em encomendas',
      value: formatCurrency(stats.revenue ?? 0),
      icon: HiOutlineCash,
      tone: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ key, label, value, icon: Icon, tone }) => (
        <div key={key} className="card flex items-center gap-4 p-4">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl ${tone}`}>
            <Icon />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium uppercase tracking-wide text-neutral-500">
              {label}
            </p>
            {loading ? (
              <div className="mt-1.5 h-6 w-20 animate-pulse rounded bg-neutral-200" />
            ) : (
              <p className="truncate text-xl font-semibold text-neutral-900">{value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
