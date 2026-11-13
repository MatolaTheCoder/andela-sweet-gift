import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import Pagination, { usePagination } from '../../components/ui/Pagination';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { Skeleton, SkeletonRows } from '../../components/ui/Skeleton';
import { getErrorMessage, getOrders, getProducts } from '../../lib/api';
import { formatCurrency, formatDate, initials } from '../../lib/format';

export default function Cliente() {
  const { id } = useParams();
  const clientName = decodeURIComponent(id ?? '');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([getOrders(), getProducts()])
      .then(([orderList, productList]) => {
        if (!active) return;
        setOrders(orderList ?? []);
        setProducts(productList ?? []);
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError, 'Não foi possível carregar o cliente.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const clientOrders = useMemo(
    () =>
      orders
        .filter(
          (order) =>
            String(order.solicitante ?? '').trim().toLowerCase() === clientName.trim().toLowerCase()
        )
        .sort((a, b) => new Date(b.data_criacao ?? 0) - new Date(a.data_criacao ?? 0)),
    [orders, clientName]
  );

  const pagination = usePagination(clientOrders);

  const productNames = useMemo(() => {
    const map = new Map();
    products.forEach((product) => map.set(String(product.id), product.nome));
    return map;
  }, [products]);

  const total = clientOrders.reduce((sum, order) => sum + (Number(order.valor) || 0), 0);
  const lastOrder = clientOrders[0]?.data_criacao;
  const recipients = new Set(clientOrders.map((order) => order.destinatario).filter(Boolean));

  return (
    <div>
      <PageHeader
        breadcrumb="Clientes"
        title={clientName || 'Cliente'}
        description={
          loading
            ? 'A carregar dados do cliente...'
            : `${clientOrders.length} encomenda(s) · ${formatCurrency(total)} em compras`
        }
        actions={
          <Link to="/clientes" className="btn btn-secondary">
            <HiOutlineArrowLeft /> Voltar aos clientes
          </Link>
        }
      />

      <ErrorBanner message={error} />

      {loading ? (
        <div className="flex flex-col gap-5" aria-busy="true">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="card space-y-2 p-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-header">
              <Skeleton className="h-5 w-48" />
            </div>
            <table className="w-full text-left">
              <tbody>
                <SkeletonRows rows={5} widths={['w-10', 'w-32', 'w-28', 'w-36', 'w-8', 'w-20', 'w-24']} />
              </tbody>
            </table>
          </div>
        </div>
      ) : clientOrders.length === 0 ? (
        <EmptyState
          title="Cliente sem encomendas"
          message="Não foram encontradas encomendas associadas a este cliente."
          action={
            <Link to="/clientes" className="btn btn-primary">
              Voltar aos clientes
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="card flex items-center gap-4 p-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-50 text-sm font-semibold text-purple-700">
                {initials(clientName)}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">
                  Cliente
                </p>
                <p className="truncate text-sm font-semibold text-neutral-900">{clientName}</p>
              </div>
            </div>

            <div className="card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">
                Encomendas
              </p>
              <p className="text-xl font-semibold text-neutral-900">{clientOrders.length}</p>
            </div>

            <div className="card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">
                Total em compras
              </p>
              <p className="text-xl font-semibold text-neutral-900">{formatCurrency(total)}</p>
            </div>

            <div className="card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">
                Última encomenda
              </p>
              <p className="text-sm font-semibold text-neutral-900">{formatDate(lastOrder)}</p>
              <p className="text-xs text-neutral-600">
                {recipients.size} destinatário(s)
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-base font-semibold text-neutral-900">Histórico de encomendas</h2>
              <span className="text-xs text-neutral-600">{clientOrders.length} registos</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="th">Nº</th>
                    <th className="th">Produto</th>
                    <th className="th">Destinatário</th>
                    <th className="th">Endereço</th>
                    <th className="th">Qtd.</th>
                    <th className="th">Valor</th>
                    <th className="th">Entrega</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {pagination.pageItems.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50">
                      <td className="td font-medium text-neutral-800">#{order.id}</td>
                      <td className="td max-w-[14rem] truncate">
                        {productNames.get(String(order.id_produto)) ?? `Produto #${order.id_produto}`}
                      </td>
                      <td className="td max-w-[12rem] truncate">{order.destinatario ?? '—'}</td>
                      <td className="td max-w-[16rem] truncate">
                        {order.endereco_destinatario ?? '—'}
                      </td>
                      <td className="td">{order.quantidade ?? '—'}</td>
                      <td className="td">{formatCurrency(order.valor)}</td>
                      <td className="td">{formatDate(order.data_entrega)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination {...pagination} />
          </div>
        </div>
      )}
    </div>
  );
}
