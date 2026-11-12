import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ProdutoForm from './ProdutoForm';
import { getErrorMessage, getProduct, updateProduct } from '../../lib/api';

export default function ProdutosEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    getProduct(id)
      .then((data) => {
        if (active) setProduct(data);
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError, 'Produto não encontrado.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (values) => {
    setSaving(true);
    setError('');
    try {
      await updateProduct(id, values);
      navigate('/produtos/list');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Não foi possível atualizar o produto.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        breadcrumb="Produtos"
        title={product ? `Editar: ${product.nome}` : 'Editar produto'}
        description="Atualize os dados do produto."
        actions={
          <Link to="/produtos/list" className="btn btn-secondary">
            <HiOutlineArrowLeft /> Voltar à lista
          </Link>
        }
      />

      {loading ? (
        <div className="card mx-auto h-64 w-full max-w-4xl animate-pulse bg-white" />
      ) : !product ? (
        <EmptyState
          title="Produto não encontrado"
          message={error || 'O produto indicado não existe ou foi removido.'}
          action={
            <Link to="/produtos/list" className="btn btn-primary">
              Voltar à lista
            </Link>
          }
        />
      ) : (
        <>
          {error && (
            <p className="mx-auto mb-4 max-w-4xl rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          )}
          <ProdutoForm
            title="Dados do produto"
            submitLabel="Guardar alterações"
            loading={saving}
            initialValues={{
              nome: product.nome ?? '',
              descricao: product.descricao ?? '',
              preco: product.preco ?? '',
              data_criacao: String(product.data_criacao ?? '').slice(0, 10),
            }}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
}
