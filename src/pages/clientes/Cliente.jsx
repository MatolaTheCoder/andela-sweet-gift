import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlinePencilAlt } from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorBanner from '../../components/ui/ErrorBanner';
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
        <div className="card h-64 animate-pulse bg-white" />
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
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Cliente
                </p>
                <p className="truncate text-sm font-semibold text-neutral-900">{clientName}</p>
              </div>
            </div>

            <div className="card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Encomendas
              </p>
              <p className="text-xl font-semibold text-neutral-900">{clientOrders.length}</p>
            </div>

            <div className="card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Total em compras
              </p>
              <p className="text-xl font-semibold text-neutral-900">{formatCurrency(total)}</p>
            </div>

            <div className="card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Última encomenda
              </p>
              <p className="text-sm font-semibold text-neutral-900">{formatDate(lastOrder)}</p>
              <p className="text-xs text-neutral-500">
                {recipients.size} destinatário(s)
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-sm font-semibold text-neutral-800">Histórico de encomendas</h2>
              <span className="text-xs text-neutral-500">{clientOrders.length} registos</span>
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
                    <th className="th text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {clientOrders.map((order) => (
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
                      <td className="td">
                        <div className="flex justify-end">
                          <Link
                            to={`/encomendas/${order.id}/editar`}
                            className="btn btn-ghost px-2 py-1.5 text-sky-600 hover:text-sky-700"
                            aria-label={`Editar encomenda ${order.id}`}
                            title="Editar encomenda"
                          >
                            <HiOutlinePencilAlt />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
