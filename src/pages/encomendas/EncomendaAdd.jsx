import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import EncomendaForm from './EncomendaForm';
import { createOrder, getErrorMessage } from '../../lib/api';

export default function EncomendaAdd() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      await createOrder(values);
      navigate('/encomendas/list');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Não foi possível registar a encomenda.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        breadcrumb="Encomendas"
        title="Adicionar encomenda"
        description="Registe uma nova encomenda para um cliente."
        actions={
          <Link to="/encomendas/list" className="btn btn-secondary">
            <HiOutlineArrowLeft /> Voltar à lista
          </Link>
        }
      />
      <EncomendaForm onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  );
}
