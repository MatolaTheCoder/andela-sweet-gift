import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineSearch } from 'react-icons/hi';
import RowActions from '../../components/ui/RowActions';
import PageHeader from '../../components/ui/PageHeader';
import { SkeletonRows } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import OrderStatusBadge from '../../components/ui/OrderStatusBadge';
import FilterMenu from '../../components/ui/FilterMenu';
import Pagination, { usePagination } from '../../components/ui/Pagination';
import ErrorBanner from '../../components/ui/ErrorBanner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import EncomendaForm from './EncomendaForm';
import EstadoModal from './EstadoModal';
import {
  createOrder,
  deleteOrder,
  getErrorMessage,
  getOrders,
  getProducts,
  updateOrderStatus,
} from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { exportCsv } from '../../lib/exportCsv';
import { formatCurrency, formatDate } from '../../lib/format';
import { ORDER_STATUS, isOverdue, isoToday, statusOf } from '../../lib/orderStatus';

/** Filtro de data de entrega: hoje ou nos próximos 7 dias. */
function matchesDelivery(order, filter) {
  if (filter === 'todas') return true;
  const today = isoToday();
  if (filter === 'hoje') return order.data_entrega === today;
  const limit = new Date();
  limit.setDate(limit.getDate() + 7);
  const pad = (value) => String(value).padStart(2, '0');
  const end = `${limit.getFullYear()}-${pad(limit.getMonth() + 1)}-${pad(limit.getDate())}`;
  return order.data_entrega >= today && order.data_entrega <= end;
}

export default function Encomenda() {
  const { can } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [encomendas, setEncomendas] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [term, setTerm] = useState(searchParams.get('q') ?? '');
  const [estadoFilter, setEstadoFilter] = useState(searchParams.get('estado') ?? 'todos');
  const [entregaFilter, setEntregaFilter] = useState('todas');
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [statusTarget, setStatusTarget] = useState(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [toast, setToast] = useState(null);

  const openNew = () => {
    setFormError('');
    setFormOpen(true);
  };
  const closeForm = () => {
    if (!saving) setFormOpen(false);
  };

  // Atalhos como /encomendas/list?novo=1 abrem logo o modal de nova encomenda.
  useEffect(() => {
    if (searchParams.get('novo')) {
      if (can('encomendas.criar')) openNew();
      const next = new URLSearchParams(searchParams);
      next.delete('novo');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams, can]);

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

  const filters = useMemo(() => {
    const count = (predicate) => encomendas.filter(predicate).length;
    return [
      { key: 'todos', label: 'Todas', count: encomendas.length },
      ...ORDER_STATUS.map((status) => ({
        key: status.key,
        label: status.label,
        count: count((order) => order.estado === status.key),
      })),
      { key: 'atraso', label: 'Em atraso', count: count((order) => isOverdue(order)) },
    ];
  }, [encomendas]);

  const filtered = useMemo(() => {
    const search = term.trim().toLowerCase();
    const list = [...encomendas]
      .sort((a, b) => b.id - a.id)
      .filter((order) => {
        if (estadoFilter === 'todos') return true;
        if (estadoFilter === 'atraso') return isOverdue(order);
        return order.estado === estadoFilter;
      })
      .filter((order) => matchesDelivery(order, entregaFilter));
    if (!search) return list;
    return list.filter((order) =>
      [order.solicitante, order.destinatario, String(order.id), String(order.id_produto)]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(search))
    );
  }, [encomendas, term, estadoFilter, entregaFilter]);

  const pagination = usePagination(filtered);

  const handleSubmit = async (values) => {
    setSaving(true);
    setFormError('');
    try {
      const created = await createOrder(values);
      setEncomendas((current) => [...current, created]);
      // O stock mudou: atualiza as quantidades mostradas nos formulários seguintes.
      setProducts((await getProducts()) ?? []);
      setFormOpen(false);
      setToast({
        title: 'Encomenda registada',
        message: `Encomenda #${created.id} de ${values.solicitante} foi registada.`,
      });
    } catch (requestError) {
      setFormError(getErrorMessage(requestError, 'Não foi possível registar a encomenda.'));
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (estado) => {
    if (!statusTarget) return;
    setStatusSaving(true);
    setStatusError('');
    try {
      const updated = await updateOrderStatus(statusTarget.id, estado);
      setEncomendas((current) => current.map((order) => (order.id === updated.id ? updated : order)));
      setStatusTarget(null);
      setToast({
        title: 'Estado atualizado',
        message: `Encomenda #${updated.id}: ${statusOf(updated).label}.`,
      });
    } catch (requestError) {
      setStatusError(getErrorMessage(requestError, 'Não foi possível atualizar o estado.'));
    } finally {
      setStatusSaving(false);
    }
  };

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

  const handleExport = () =>
    exportCsv('encomendas.csv', [
      { header: 'Nº', value: (o) => o.id },
      { header: 'Produto', value: (o) => productNames.get(String(o.id_produto)) ?? o.id_produto },
      { header: 'Quantidade', value: (o) => o.quantidade },
      { header: 'Valor (MZN)', value: (o) => o.valor },
      { header: 'Estado', value: (o) => statusOf(o).label },
      { header: 'Solicitante', value: (o) => o.solicitante },
      { header: 'Destinatário', value: (o) => o.destinatario },
      { header: 'Endereço', value: (o) => o.endereco_destinatario },
      { header: 'Criada em', value: (o) => o.data_criacao },
      { header: 'Entrega', value: (o) => o.data_entrega },
    ], filtered);

  const filterGroups = [
    {
      key: 'estado',
      label: 'Estado',
      value: estadoFilter,
      options: filters.map((item) => ({ value: item.key, label: item.label, count: item.count })),
    },
    {
      key: 'entrega',
      label: 'Entrega',
      value: entregaFilter,
      options: [
        { value: 'todas', label: 'Qualquer data' },
        { value: 'hoje', label: 'Hoje' },
        { value: 'semana', label: 'Próximos 7 dias' },
      ],
    },
  ];
  const handleFilter = (key, value) => (key === 'estado' ? setEstadoFilter(value) : setEntregaFilter(value));

  const addButton = can('encomendas.criar') ? (
    <button type="button" className="btn btn-primary" onClick={openNew}>
      <HiOutlinePlus /> Adicionar encomenda
    </button>
  ) : null;

  return (
    <div>
      <PageHeader
        breadcrumb="Encomendas"
        title="Encomendas"
        description="Acompanhe o estado, imprima recibos e gira as encomendas."
        actions={
          <>
            <button type="button" className="btn btn-secondary" onClick={handleExport} disabled={filtered.length === 0}>
              Exportar CSV
            </button>
            {addButton}
          </>
        }
      />

      <ErrorBanner message={error} onRetry={loadData} />

      {!error && (
        <div className="card">
          <div className="card-header">
            <div className="relative w-full max-w-sm">
              <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Pesquisar por cliente, destinatário ou nº"
                aria-label="Pesquisar encomendas"
                className="input h-9 pl-9"
              />
            </div>
            <span className="text-xs font-medium text-neutral-600">
              {filtered.length} de {encomendas.length} encomendas
            </span>
          </div>

          <div className="border-b border-neutral-200 px-4 py-3 sm:px-5">
            <FilterMenu groups={filterGroups} onChange={handleFilter} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left" aria-busy={loading}>
              <thead className="bg-neutral-50">
                <tr>
                  <th className="th">Nº</th>
                  <th className="th">Produto</th>
                  <th className="th">Solicitante</th>
                  <th className="th">Destinatário</th>
                  <th className="th">Valor</th>
                  <th className="th">Entrega</th>
                  <th className="th">Estado</th>
                  <th className="th text-right">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading && (
                  <SkeletonRows
                    rows={8}
                    widths={['w-10', 'w-40', 'w-28', 'w-28', 'w-20', 'w-24', 'w-24', 'w-32']}
                    lastRight
                  />
                )}

                {!loading &&
                  pagination.pageItems.map((order) => {
                    return (
                      <tr key={order.id} className="hover:bg-neutral-50">
                        <td className="td font-medium text-neutral-800">#{order.id}</td>
                        <td className="td max-w-[13rem] truncate">
                          {productNames.get(String(order.id_produto)) ?? `Produto #${order.id_produto}`}
                          <span className="ml-1 text-neutral-600">× {order.quantidade ?? 1}</span>
                        </td>
                        <td className="td max-w-[9rem] truncate">{order.solicitante ?? '—'}</td>
                        <td className="td max-w-[9rem] truncate">{order.destinatario ?? '—'}</td>
                        <td className="td">{formatCurrency(order.valor)}</td>
                        <td className="td">
                          {formatDate(order.data_entrega)}
                        </td>
                        <td className="td">
                          <OrderStatusBadge order={order} />
                        </td>
                        <td className="td">
                          <RowActions
                            actions={[
                              {
                                label: 'Recibo',
                                to: `/encomendas/${order.id}/recibo`,
                                ariaLabel: `Ver recibo da encomenda ${order.id}`,
                              },
                              can('encomendas.estado') && {
                                label: 'Alterar estado',
                                onClick: () => {
                                  setStatusError('');
                                  setStatusTarget(order);
                                },
                                ariaLabel: `Atualizar estado da encomenda ${order.id}`,
                              },
                              can('encomendas.eliminar') && {
                                label: 'Eliminar',
                                danger: true,
                                onClick: () => setSelected(order),
                                ariaLabel: `Eliminar encomenda ${order.id}`,
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState
                        title={encomendas.length === 0 ? 'Sem encomendas registadas' : 'Nenhum resultado'}
                        message={
                          encomendas.length === 0
                            ? 'Adicione ou importe registos para começar.'
                            : 'Tente ajustar a pesquisa ou o filtro de estado.'
                        }
                        action={encomendas.length === 0 ? addButton : null}
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

      <Modal
        open={formOpen}
        title="Adicionar encomenda"
        description="Registe uma nova encomenda. O stock do produto é abatido automaticamente."
        onClose={closeForm}
      >
        {formOpen && (
          <EncomendaForm
            submitLabel="Registar encomenda"
            loading={saving}
            error={formError}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        )}
      </Modal>

      <EstadoModal
        order={statusTarget}
        saving={statusSaving}
        error={statusError}
        onSave={handleStatus}
        onClose={() => setStatusTarget(null)}
      />

      <Alert
        open={Boolean(toast)}
        type="success"
        title={toast?.title}
        message={toast?.message}
        onClose={() => setToast(null)}
        autoClose={3000}
      />

      <ConfirmDialog
        open={Boolean(selected)}
        title="Eliminar encomenda"
        description={
          selected
            ? `Tem a certeza de que quer eliminar a encomenda #${selected.id}? Esta ação não pode ser revertida.${
                selected.estado === 'pendente' || selected.estado === 'preparacao'
                  ? ' O stock reservado volta ao armazém.'
                  : ''
              }`
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
