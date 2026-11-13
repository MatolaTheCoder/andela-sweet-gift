import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineExclamation, HiOutlineExclamationCircle, HiOutlinePlus, HiOutlineSearch } from 'react-icons/hi';
import RowActions from '../../components/ui/RowActions';
import PageHeader from '../../components/ui/PageHeader';
import { SkeletonRows } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import FilterMenu from '../../components/ui/FilterMenu';
import ProductThumb from '../../components/ui/ProductThumb';
import Pagination, { usePagination } from '../../components/ui/Pagination';
import ErrorBanner from '../../components/ui/ErrorBanner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import ProdutoForm from './ProdutoForm';
import {
  createProduct,
  deleteProduct,
  getErrorMessage,
  getProducts,
  updateProduct,
} from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { exportCsv } from '../../lib/exportCsv';
import { formatCurrency, formatDate } from '../../lib/format';
import { stockLevel } from '../../lib/orderStatus';

export default function Produtos() {
  const { can } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [term, setTerm] = useState(searchParams.get('q') ?? '');
  const [stockFilter, setStockFilter] = useState(searchParams.get('stock') ?? 'todos');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formTarget, setFormTarget] = useState(null); // {} = novo; produto = edição
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState(null);

  const openNew = () => {
    setFormError('');
    setFormTarget({});
  };
  const openEdit = (produto) => {
    setFormError('');
    setFormTarget(produto);
  };
  const closeForm = () => {
    if (!saving) setFormTarget(null);
  };

  // Atalhos como /produtos/list?novo=1 abrem logo o modal de novo produto.
  useEffect(() => {
    if (searchParams.get('novo')) {
      if (can('produtos.criar')) openNew();
      const next = new URLSearchParams(searchParams);
      next.delete('novo');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams, can]);

  const loadProducts = () => {
    setLoading(true);
    setError('');
    getProducts()
      .then((data) => setProdutos(data ?? []))
      .catch((requestError) =>
        setError(getErrorMessage(requestError, 'Não foi possível carregar os produtos.'))
      )
      .finally(() => setLoading(false));
  };

  useEffect(loadProducts, []);

  useEffect(() => {
    setTerm(searchParams.get('q') ?? '');
  }, [searchParams]);

  const counts = useMemo(
    () => ({
      todos: produtos.length,
      baixo: produtos.filter((produto) => stockLevel(produto).key === 'baixo').length,
      sem: produtos.filter((produto) => stockLevel(produto).key === 'sem').length,
    }),
    [produtos]
  );

  const filtered = useMemo(() => {
    const search = term.trim().toLowerCase();
    const list = [...produtos]
      .sort((a, b) => b.id - a.id)
      .filter((produto) => stockFilter === 'todos' || stockLevel(produto).key === stockFilter)
      .filter((produto) => categoryFilter === 'todas' || produto.categoria === categoryFilter);
    if (!search) return list;
    return list.filter((produto) =>
      [produto.nome, produto.descricao, produto.categoria, String(produto.id)]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(search))
    );
  }, [produtos, term, stockFilter, categoryFilter]);

  const pagination = usePagination(filtered);

  const handleSearch = (event) => {
    const value = event.target.value;
    setTerm(value);
    if (value.trim()) {
      setSearchParams({ q: value }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleSubmit = async (values) => {
    const editing = Boolean(formTarget?.id);
    setSaving(true);
    setFormError('');
    try {
      if (editing) {
        const updated = await updateProduct(formTarget.id, values);
        setProdutos((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await createProduct(values);
        setProdutos((current) => [...current, created]);
      }
      setFormTarget(null);
      setToast({
        title: editing ? 'Produto atualizado' : 'Produto registado',
        message: `"${values.nome}" foi ${editing ? 'atualizado' : 'adicionado ao catálogo'}.`,
      });
    } catch (requestError) {
      setFormError(getErrorMessage(requestError, 'Não foi possível guardar o produto.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      await deleteProduct(selected.id);
      setProdutos((current) => current.filter((produto) => produto.id !== selected.id));
      setSelected(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Não foi possível eliminar o produto.'));
      setSelected(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () =>
    exportCsv('produtos.csv', [
      { header: 'ID', value: (p) => p.id },
      { header: 'Nome', value: (p) => p.nome },
      { header: 'Descrição', value: (p) => p.descricao },
      { header: 'Categoria', value: (p) => p.categoria },
      { header: 'Preço (MZN)', value: (p) => p.preco },
      { header: 'Stock', value: (p) => p.stock },
      { header: 'Stock mínimo', value: (p) => p.stock_minimo },
      { header: 'Criado em', value: (p) => p.data_criacao },
    ], filtered);

  const categories = [...new Set(produtos.map((produto) => produto.categoria).filter(Boolean))].sort();
  const filterGroups = [
    {
      key: 'stock',
      label: 'Stock',
      value: stockFilter,
      options: [
        { value: 'todos', label: 'Todos', count: counts.todos },
        { value: 'baixo', label: 'Stock baixo', count: counts.baixo },
        { value: 'sem', label: 'Sem stock', count: counts.sem },
      ],
    },
    {
      key: 'categoria',
      label: 'Categoria',
      value: categoryFilter,
      options: [
        { value: 'todas', label: 'Todas' },
        ...categories.map((category) => ({
          value: category,
          label: category,
          count: produtos.filter((produto) => produto.categoria === category).length,
        })),
      ],
    },
  ];
  const handleFilter = (key, value) => (key === 'stock' ? setStockFilter(value) : setCategoryFilter(value));

  const addButton = can('produtos.criar') ? (
    <button type="button" className="btn btn-primary" onClick={openNew}>
      <HiOutlinePlus /> Adicionar produto
    </button>
  ) : null;

  return (
    <div>
      <PageHeader
        breadcrumb="Produtos"
        title="Produtos"
        description="Catálogo de produtos, fotos e stock."
        actions={
          <>
            <button type="button" className="btn btn-secondary" onClick={handleExport} disabled={filtered.length === 0}>
              Exportar CSV
            </button>
            {addButton}
          </>
        }
      />

      <ErrorBanner message={error} onRetry={loadProducts} />

      {!error && (
        <div className="card">
          <div className="card-header">
            <div className="relative w-full max-w-sm">
              <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="search"
                value={term}
                onChange={handleSearch}
                placeholder="Pesquisar por nome, categoria ou ID"
                aria-label="Pesquisar produtos"
                className="input h-9 pl-9"
              />
            </div>
            <FilterMenu groups={filterGroups} onChange={handleFilter} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left" aria-busy={loading}>
              <thead className="bg-neutral-50">
                <tr>
                  <th className="th">
                    <span className="sr-only">Foto</span>
                  </th>
                  <th className="th">Produto</th>
                  <th className="th">Categoria</th>
                  <th className="th">Preço</th>
                  <th className="th">Stock</th>
                  <th className="th">Criado em</th>
                  <th className="th text-right">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading && (
                  <SkeletonRows rows={8} widths={['w-10', 'w-52', 'w-20', 'w-20', 'w-24', 'w-24', 'w-28']} lastRight />
                )}

                {!loading &&
                  pagination.pageItems.map((produto) => {
                    const level = stockLevel(produto);
                    return (
                      <tr key={produto.id} className="hover:bg-neutral-50">
                        <td className="td font-medium text-neutral-800">
                            <ProductThumb src={produto.imagem} name={produto.nome} />
                        </td>
                        <td className="td max-w-[22rem]">
                          <div className="flex items-center gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-medium text-neutral-800">{produto.nome}</p>
                              <p className="truncate text-xs text-neutral-600">{produto.descricao}</p>
                            </div>
                          </div>
                        </td>
                        <td className="td">{produto.categoria ?? '—'}</td>
                        <td className="td">{formatCurrency(produto.preco)}</td>
                        <td className="td">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-800">{produto.stock ?? 0}</span>
                            {level.key !== 'ok' && (
                              <StatusBadge
                                status={level.label}
                                tone={level.tone}
                                icon={level.key === 'sem' ? HiOutlineExclamationCircle : HiOutlineExclamation}
                              />
                            )}
                          </div>
                        </td>
                        <td className="td">{formatDate(produto.data_criacao)}</td>
                        <td className="td">
                          <RowActions
                            actions={[
                              can('produtos.editar') && {
                                label: 'Editar',
                                onClick: () => openEdit(produto),
                                ariaLabel: `Editar ${produto.nome}`,
                              },
                              can('produtos.eliminar') && {
                                label: 'Eliminar',
                                danger: true,
                                onClick: () => setSelected(produto),
                                ariaLabel: `Eliminar ${produto.nome}`,
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState
                        title={produtos.length === 0 ? 'Sem produtos registados' : 'Nenhum resultado'}
                        message={
                          produtos.length === 0
                            ? 'Adicione ou importe registos para começar.'
                            : 'Tente ajustar a pesquisa ou o filtro de stock.'
                        }
                        action={produtos.length === 0 ? addButton : null}
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
        open={Boolean(formTarget)}
        size="xl"
        title={formTarget?.id ? 'Editar produto' : 'Adicionar produto'}
        description={
          formTarget?.id
            ? `Atualize os dados de "${formTarget.nome}".`
            : 'Registe um novo produto, com foto e stock.'
        }
        onClose={closeForm}
      >
        {formTarget && (
          <ProdutoForm
            initialValues={formTarget.id ? formTarget : {}}
            submitLabel={formTarget.id ? 'Guardar alterações' : 'Registar produto'}
            loading={saving}
            error={formError}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        )}
      </Modal>

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
        title="Eliminar produto"
        description={
          selected
            ? `Tem a certeza de que quer eliminar "${selected.nome}"? Esta ação não pode ser revertida.`
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
