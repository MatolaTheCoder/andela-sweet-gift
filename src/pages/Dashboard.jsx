import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi';
import PageHeader from '../components/ui/PageHeader';
import { Skeleton } from '../components/ui/Skeleton';
import DashboardStatsGrid from '../components/dashboard/DashboardStatsGrid';
import DashboardChart from '../components/dashboard/DashboardChart';
import DashboardBuyerChart from '../components/dashboard/DashboardBuyerChart';
import RecentOrders from '../components/dashboard/DashboardRecentOrders';
import PopularProducts from '../components/dashboard/DashboardPopularProducts';
import { getOrders, getProducts } from '../lib/api';
import { groupOrdersByClient } from '../lib/clients';
import { formatCurrency, formatNumber } from '../lib/format';
import { salesByMonth } from '../lib/stats';
import { useSettings } from '../lib/settings';

export default function Dashboard() {
  const { settings } = useSettings();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.allSettled([getOrders(), getProducts()]).then(([ordersResult, productsResult]) => {
      if (!active) return;
      if (ordersResult.status === 'fulfilled') setOrders(ordersResult.value ?? []);
      if (productsResult.status === 'fulfilled') setProducts(productsResult.value ?? []);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const liveOrders = useMemo(() => orders.filter((order) => order.estado !== 'cancelada'), [orders]);
  const clients = useMemo(() => groupOrdersByClient(orders), [orders]);
  const revenue = useMemo(
    () => liveOrders.reduce((total, order) => total + (Number(order.valor) || 0), 0),
    [orders]
  );

  const now = new Date();
  const monthSales = salesByMonth(orders, now.getFullYear())[now.getMonth()];
  const monthOrders = liveOrders.filter((order) => {
    const date = new Date(order.data_criacao);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }).length;
  const today = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'full' }).format(now);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        variant="hero"
        breadcrumb={today}
        title="Dashboard"
        description={`Visão geral da atividade da ${settings.empresa}.`}
        actions={
          <>
            <Link to="/produtos/list?novo=1" className="btn btn-outline-light">
              <HiOutlinePlus /> Novo produto
            </Link>
            <Link to="/encomendas/list?novo=1" className="btn btn-light">
              <HiOutlinePlus /> Nova encomenda
            </Link>
          </>
        }
      >
        <dl className="grid max-w-xl grid-cols-2 gap-4 border-t border-purple-700 pt-4">
          <div>
            <dt className="text-sm text-[#e9d5ff]">Vendas este mês</dt>
            <dd className="text-2xl font-semibold">{loading ? <Skeleton light className="mt-1 h-7 w-36" /> : formatCurrency(monthSales)}</dd>
          </div>
          <div>
            <dt className="text-sm text-[#e9d5ff]">Encomendas este mês</dt>
            <dd className="text-2xl font-semibold">{loading ? <Skeleton light className="mt-1 h-7 w-12" /> : formatNumber(monthOrders)}</dd>
          </div>
        </dl>
      </PageHeader>

      <DashboardStatsGrid
        loading={loading}
        stats={{
          orders: liveOrders.length,
          products: products.length,
          clients: clients.length,
          revenue,
        }}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <DashboardChart orders={orders} loading={loading} />
        </div>
        <div className="min-w-0">
          <DashboardBuyerChart orders={orders} loading={loading} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <RecentOrders orders={orders} loading={loading} />
        </div>
        <div className="min-w-0">
          <PopularProducts />
        </div>
      </div>
    </div>
  );
}
