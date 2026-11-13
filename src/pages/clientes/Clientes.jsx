import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineSearch, HiOutlineUsers } from 'react-icons/hi';
import RowActions from '../../components/ui/RowActions';
import PageHeader from '../../components/ui/PageHeader';
import { SkeletonRows } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Pagination, { usePagination } from '../../components/ui/Pagination';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { getErrorMessage, getOrders } from '../../lib/api';
import { groupOrdersByClient } from '../../lib/clients';
import { formatCurrency, formatDate, initials } from '../../lib/format';

export default function Clientes() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [term, setTerm] = useState('');

  const loadClients = () => {
    setLoading(true);
    setError('');
    getOrders()
      .then((data) => setOrders(data ?? []))
      .catch((requestError) =>
        setError(getErrorMessage(requestError, 'Não foi possível carregar os clientes.'))
      )
      .finally(() => setLoading(false));
  };

  useEffect(loadClients, []);

  const clients = useMemo(() => groupOrdersByClient(orders), [orders]);

  const filtered = useMemo(() => {
    const search = term.trim().toLowerCase();
    if (!search) return clients;
    return clients.filter((client) => client.nome.toLowerCase().includes(search));
  }, [clients, term]);

  const pagination = usePagination(filtered);

  return (
    <div>
      <PageHeader
        breadcrumb="Clientes"
        title="Clientes"
        description="Clientes agregados a partir das encomendas registadas."
        actions={
          <Link to="/encomendas/list?novo=1" className="btn btn-primary">
            <HiOutlinePlus /> Nova encomenda
          </Link>
        }
      />

      <ErrorBanner message={error} onRetry={loadClients} />

      {!error && (
        <div className="card">
          <div className="card-header">
            <div className="relative w-full max-w-sm">
              <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Pesquisar cliente"
                aria-label="Pesquisar clientes"
                className="input h-9 pl-9"
              />
            </div>
            <span className="text-xs font-medium text-neutral-600">
              {filtered.length} de {clients.length} clientes
            </span>
          </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left" aria-busy={loading}>
            <thead className="bg-neutral-50">
              <tr>
                <th className="th">Cliente</th>
                <th className="th">Encomendas</th>
                <th className="th">Total gasto</th>
                <th className="th">Última encomenda</th>
                <th className="th text-right">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading && <SkeletonRows rows={8} widths={['w-44', 'w-10', 'w-20', 'w-24', 'w-20']} lastRight />}

              {!loading &&
                pagination.pageItems.map((client) => (
                  <tr key={client.nome} className="hover:bg-neutral-50">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-50 text-xs font-semibold text-purple-700">
                          {initials(client.nome)}
                        </span>
                        <span className="max-w-[16rem] truncate font-medium text-neutral-800">
                          {client.nome}
                        </span>
                      </div>
                    </td>
                    <td className="td">{client.encomendas}</td>
                    <td className="td font-medium text-neutral-800">
                      {formatCurrency(client.total)}
                    </td>
                    <td className="td">{formatDate(client.ultima)}</td>
                    <td className="td">
                      <RowActions
                        actions={[
                          {
                            label: 'Ver detalhe',
                            to: `/clientes/${encodeURIComponent(client.nome)}`,
                            ariaLabel: `Ver detalhe do cliente ${client.nome}`,
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={HiOutlineUsers}
                      title={clients.length === 0 ? 'Ainda sem clientes' : 'Nenhum resultado'}
                      message={
                        clients.length === 0
                          ? 'Os clientes aparecem aqui quando existirem encomendas registadas.'
                          : 'Tente ajustar a pesquisa.'
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination {...pagination} />
      </div>
      )}
    </div>
  );
}
