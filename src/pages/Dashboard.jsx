import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi';
import PageHeader from '../components/ui/PageHeader';
import DashboardStatsGrid from '../components/dashboard/DashboardStatsGrid';
import DashboardChart from '../components/dashboard/DashboardChart';
import DashboardBuyerChart from '../components/dashboard/DashboardBuyerChart';
import RecentOrders from '../components/dashboard/DashboardRecentOrders';
import PopularProducts from '../components/dashboard/DashboardPopularProducts';
import { getOrders, getProducts } from '../lib/api';
import { groupOrdersByClient } from '../lib/clients';

export default function Dashboard() {
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

  const clients = useMemo(() => groupOrdersByClient(orders), [orders]);
  const revenue = useMemo(
    () => orders.reduce((total, order) => total + (Number(order.valor) || 0), 0),
    [orders]
  );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Dashboard"
        description="Visão geral da atividade da Andela Sweet Gift."
        actions={
          <>
            <Link to="/produtos/add" className="btn btn-secondary">
              <HiOutlinePlus /> Novo produto
            </Link>
            <Link to="/encomendas/add" className="btn btn-primary">
              <HiOutlinePlus /> Nova encomenda
            </Link>
          </>
        }
      />

      <DashboardStatsGrid
        loading={loading}
        stats={{
          orders: orders.length,
          products: products.length,
          clients: clients.length,
          revenue,
        }}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <DashboardChart />
        </div>
        <div className="min-w-0">
          <DashboardBuyerChart />
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
