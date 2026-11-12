import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import EncomendaForm from './EncomendaForm';
import { getErrorMessage, getOrder, updateOrder } from '../../lib/api';

export default function EncomendaEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    getOrder(id)
      .then((data) => {
        if (active) setOrder(data);
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError, 'Encomenda não encontrada.'));
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
      await updateOrder(id, values);
      navigate('/encomendas/list');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Não foi possível atualizar a encomenda.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        breadcrumb="Encomendas"
        title={order ? `Editar encomenda #${order.id}` : 'Editar encomenda'}
        description="Atualize os dados da encomenda."
        actions={
          <Link to="/encomendas/list" className="btn btn-secondary">
            <HiOutlineArrowLeft /> Voltar à lista
          </Link>
        }
      />

      {loading ? (
        <div className="card mx-auto h-64 w-full max-w-4xl animate-pulse bg-white" />
      ) : !order ? (
        <EmptyState
          title="Encomenda não encontrada"
          message={error || 'A encomenda indicada não existe ou foi removida.'}
          action={
            <Link to="/encomendas/list" className="btn btn-primary">
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
          <EncomendaForm
            submitLabel="Guardar alterações"
            loading={saving}
            initialValues={{
              solicitante: order.solicitante ?? '',
              destinatario: order.destinatario ?? '',
              id_produto: order.id_produto ?? '',
              quantidade: order.quantidade ?? 1,
              valor: order.valor ?? '',
              endereco_destinatario: order.endereco_destinatario ?? '',
              data_criacao: String(order.data_criacao ?? '').slice(0, 10),
              data_entrega: String(order.data_entrega ?? '').slice(0, 10),
            }}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
}
