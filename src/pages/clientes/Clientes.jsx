import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineEye, HiOutlinePlus, HiOutlineSearch, HiOutlineUsers } from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
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

  return (
    <div>
      <PageHeader
        breadcrumb="Clientes"
        title="Clientes"
        description="Clientes agregados a partir das encomendas registadas."
        actions={
          <Link to="/encomendas/add" className="btn btn-primary">
            <HiOutlinePlus /> Nova encomenda
          </Link>
        }
      />

      <ErrorBanner message={error} onRetry={loadClients} />

      {!error && (
        <div className="card">
          <div className="card-header">
            <div className="relative w-full max-w-sm">
              <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Pesquisar cliente"
                aria-label="Pesquisar clientes"
                className="input h-9 pl-9"
              />
            </div>
            <span className="text-xs font-medium text-neutral-500">
              {filtered.length} de {clients.length} clientes
            </span>
          </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-neutral-50">
              <tr>
                <th className="th">Cliente</th>
                <th className="th">Encomendas</th>
                <th className="th">Total gasto</th>
                <th className="th">Última encomenda</th>
                <th className="th text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading &&
                [0, 1, 2].map((row) => (
                  <tr key={`skeleton-${row}`}>
                    <td colSpan={5} className="px-4 py-3">
                      <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
                    </td>
                  </tr>
                ))}

              {!loading &&
                filtered.map((client) => (
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
                      <div className="flex justify-end">
                        <Link
                          to={`/clientes/${encodeURIComponent(client.nome)}`}
                          className="btn btn-ghost px-2 py-1.5 text-sky-600 hover:text-sky-700"
                          aria-label={`Ver cliente ${client.nome}`}
                          title="Ver detalhe"
                        >
                          <HiOutlineEye />
                        </Link>
                      </div>
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
      </div>
      )}
    </div>
  );
}
