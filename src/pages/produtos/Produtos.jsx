import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineSearch } from 'react-icons/hi';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorBanner from '../../components/ui/ErrorBanner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { deleteProduct, getErrorMessage, getProducts } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/format';

export default function Produtos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [term, setTerm] = useState(searchParams.get('q') ?? '');
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const filtered = useMemo(() => {
    const search = term.trim().toLowerCase();
    if (!search) return produtos;
    return produtos.filter((produto) =>
      [produto.nome, produto.descricao, String(produto.id)]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(search))
    );
  }, [produtos, term]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setTerm(value);
    if (value.trim()) {
      setSearchParams({ q: value }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
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

  return (
    <div>
      <PageHeader
        breadcrumb="Produtos"
        title="Produtos"
        description="Catálogo de produtos disponíveis na loja."
        actions={
          <Link to="/produtos/add" className="btn btn-primary">
            <HiOutlinePlus /> Adicionar produto
          </Link>
        }
      />

      <ErrorBanner message={error} onRetry={loadProducts} />

      {!error && (
        <div className="card">
          <div className="card-header">
            <div className="relative w-full max-w-sm">
              <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                value={term}
                onChange={handleSearch}
                placeholder="Pesquisar por nome, descrição ou ID"
                aria-label="Pesquisar produtos"
                className="input h-9 pl-9"
              />
            </div>
            <span className="text-xs font-medium text-neutral-500">
              {filtered.length} de {produtos.length} produtos
            </span>
          </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-neutral-50">
              <tr>
                <th className="th">ID</th>
                <th className="th">Produto</th>
                <th className="th">Preço</th>
                <th className="th">Criado em</th>
                <th className="th text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading &&
                [0, 1, 2, 3].map((row) => (
                  <tr key={`skeleton-${row}`}>
                    <td colSpan={5} className="px-4 py-3">
                      <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
                    </td>
                  </tr>
                ))}

              {!loading &&
                filtered.map((produto) => (
                  <tr key={produto.id} className="hover:bg-neutral-50">
                    <td className="td font-medium text-neutral-800">#{produto.id}</td>
                    <td className="td max-w-[22rem]">
                      <p className="truncate font-medium text-neutral-800">{produto.nome}</p>
                      <p className="truncate text-xs text-neutral-500">{produto.descricao}</p>
                    </td>
                    <td className="td">{formatCurrency(produto.preco)}</td>
                    <td className="td">{formatDate(produto.data_criacao)}</td>
                    <td className="td">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/produtos/${produto.id}/editar`}
                          className="btn btn-ghost px-2 py-1.5 text-sky-600 hover:text-sky-700"
                          aria-label={`Editar ${produto.nome}`}
                          title="Editar"
                        >
                          <MdModeEdit />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSelected(produto)}
                          className="btn btn-ghost px-2 py-1.5 text-rose-600 hover:text-rose-700"
                          aria-label={`Eliminar ${produto.nome}`}
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
                  <td colSpan={5}>
                    <EmptyState
                      title={produtos.length === 0 ? 'Sem produtos registados' : 'Nenhum resultado'}
                      message={
                        produtos.length === 0
                          ? 'Adicione o primeiro produto para começar.'
                          : 'Tente ajustar a pesquisa.'
                      }
                      action={
                        produtos.length === 0 ? (
                          <Link to="/produtos/add" className="btn btn-primary">
                            <HiOutlinePlus /> Adicionar produto
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
