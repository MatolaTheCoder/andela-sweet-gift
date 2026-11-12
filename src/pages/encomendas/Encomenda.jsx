import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineSearch } from 'react-icons/hi';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorBanner from '../../components/ui/ErrorBanner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { deleteOrder, getErrorMessage, getOrders, getProducts } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/format';

export default function Encomenda() {
  const [encomendas, setEncomendas] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [term, setTerm] = useState('');
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError('');
    Promise.all([getOrders(), getProducts()])
      .then(([orders, productList]) => {
        setEncomendas(orders ?? []);
        setProducts(productList ?? []);
      })
      .catch((requestError) =>
        setError(getErrorMessage(requestError, 'Não foi possível carregar as encomendas.'))
      )
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const productNames = useMemo(() => {
    const map = new Map();
    products.forEach((product) => map.set(String(product.id), product.nome));
    return map;
  }, [products]);

  const filtered = useMemo(() => {
    const search = term.trim().toLowerCase();
    if (!search) return encomendas;
    return encomendas.filter((order) =>
      [order.solicitante, order.destinatario, String(order.id), String(order.id_produto)]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(search))
    );
  }, [encomendas, term]);

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      await deleteOrder(selected.id);
      setEncomendas((current) => current.filter((order) => order.id !== selected.id));
      setSelected(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Não foi possível eliminar a encomenda.'));
      setSelected(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        breadcrumb="Encomendas"
        title="Encomendas"
        description="Acompanhe e gerir as encomendas registadas."
        actions={
          <Link to="/encomendas/add" className="btn btn-primary">
            <HiOutlinePlus /> Adicionar encomenda
          </Link>
        }
      />

      <ErrorBanner message={error} onRetry={loadData} />

      {!error && (
        <div className="card">
          <div className="card-header">
            <div className="relative w-full max-w-sm">
              <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Pesquisar por cliente, destinatário ou nº"
                aria-label="Pesquisar encomendas"
                className="input h-9 pl-9"
              />
            </div>
            <span className="text-xs font-medium text-neutral-500">
              {filtered.length} de {encomendas.length} encomendas
            </span>
          </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-neutral-50">
              <tr>
                <th className="th">Nº</th>
                <th className="th">Produto</th>
                <th className="th">Solicitante</th>
                <th className="th">Destinatário</th>
                <th className="th">Qtd.</th>
                <th className="th">Valor</th>
                <th className="th">Entrega</th>
                <th className="th text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading &&
                [0, 1, 2, 3].map((row) => (
                  <tr key={`skeleton-${row}`}>
                    <td colSpan={8} className="px-4 py-3">
                      <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
                    </td>
                  </tr>
                ))}

              {!loading &&
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="td font-medium text-neutral-800">#{order.id}</td>
                    <td className="td max-w-[14rem] truncate">
                      {productNames.get(String(order.id_produto)) ?? `Produto #${order.id_produto}`}
                    </td>
                    <td className="td max-w-[12rem] truncate">{order.solicitante ?? '—'}</td>
                    <td className="td max-w-[12rem] truncate">{order.destinatario ?? '—'}</td>
                    <td className="td">{order.quantidade ?? '—'}</td>
                    <td className="td">{formatCurrency(order.valor)}</td>
                    <td className="td">{formatDate(order.data_entrega)}</td>
                    <td className="td">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/encomendas/${order.id}/editar`}
                          className="btn btn-ghost px-2 py-1.5 text-sky-600 hover:text-sky-700"
                          aria-label={`Editar encomenda ${order.id}`}
                          title="Editar"
                        >
                          <MdModeEdit />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSelected(order)}
                          className="btn btn-ghost px-2 py-1.5 text-rose-600 hover:text-rose-700"
                          aria-label={`Eliminar encomenda ${order.id}`}
                          title="Eliminar"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      title={encomendas.length === 0 ? 'Sem encomendas registadas' : 'Nenhum resultado'}
                      message={
                        encomendas.length === 0
                          ? 'Registe a primeira encomenda para começar.'
                          : 'Tente ajustar a pesquisa.'
                      }
                      action={
                        encomendas.length === 0 ? (
                          <Link to="/encomendas/add" className="btn btn-primary">
                            <HiOutlinePlus /> Adicionar encomenda
                          </Link>
                        ) : null
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

      <ConfirmDialog
        open={Boolean(selected)}
        title="Eliminar encomenda"
        description={
          selected
            ? `Tem a certeza de que quer eliminar a encomenda #${selected.id}? Esta ação não pode ser revertida.`
            : ''
        }
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setSelected(null)}
      />
    </div>
  );
}
