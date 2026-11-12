import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import ProdutoForm from './ProdutoForm';
import { createProduct, getErrorMessage } from '../../lib/api';

export default function ProdutosAdd() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      await createProduct(values);
      navigate('/produtos/list');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Não foi possível registar o produto.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        breadcrumb="Produtos"
        title="Adicionar produto"
        description="Registe um novo produto no catálogo."
        actions={
          <Link to="/produtos/list" className="btn btn-secondary">
            <HiOutlineArrowLeft /> Voltar à lista
          </Link>
        }
      />
      <ProdutoForm onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  );
}
