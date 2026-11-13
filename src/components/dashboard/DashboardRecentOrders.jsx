import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';
import OrderStatusBadge from '../ui/OrderStatusBadge';
import EmptyState from '../ui/EmptyState';
import { SkeletonRows } from '../ui/Skeleton';
import { formatCurrency, formatDate } from '../../lib/format';

export default function RecentOrders({ orders = [], loading = false }) {
  const recent = [...orders]
    .sort((a, b) => new Date(b.data_criacao ?? 0) - new Date(a.data_criacao ?? 0))
    .slice(0, 5);

  return (
    <div className="card flex h-full flex-col">
      <div className="card-header">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Encomendas recentes</h2>
          <p className="text-xs text-neutral-600">Últimos registos na plataforma.</p>
        </div>
        <Link
          to="/encomendas/list"
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900"
        >
          Ver todas <HiOutlineArrowRight />
        </Link>
      </div>

      {loading ? (
        <div className="overflow-x-auto" aria-busy="true">
          <table className="w-full min-w-[560px] text-left">
            <tbody>
              <SkeletonRows rows={5} widths={['w-10', 'w-32', 'w-24', 'w-20', 'w-20']} />
            </tbody>
          </table>
        </div>
      ) : recent.length === 0 ? (
        <EmptyState
          title="Ainda sem encomendas"
          message="As encomendas registadas aparecem aqui."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead className="bg-neutral-50">
              <tr>
                <th className="th">Nº</th>
                <th className="th">Cliente</th>
                <th className="th">Data</th>
                <th className="th">Valor</th>
                <th className="th">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {recent.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50">
                  <td className="td font-medium text-neutral-800">#{order.id}</td>
                  <td className="td max-w-[12rem] truncate">{order.solicitante ?? '—'}</td>
                  <td className="td">{formatDate(order.data_criacao)}</td>
                  <td className="td">{formatCurrency(order.valor)}</td>
                  <td className="td">
                    <OrderStatusBadge order={order} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
