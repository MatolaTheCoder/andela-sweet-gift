import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InputGroup from '../../components/ui/Input';
import ErrorBanner from '../../components/ui/ErrorBanner';

export default function ProdutoForm({
  title = 'Dados do produto',
  submitLabel = 'Registar produto',
  initialValues = {},
  loading = false,
  error = '',
  onSubmit,
}) {
  const [values, setValues] = useState({
    nome: initialValues.nome ?? '',
    descricao: initialValues.descricao ?? '',
    preco: initialValues.preco ?? '',
    data_criacao: initialValues.data_criacao ?? new Date().toISOString().slice(0, 10),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(values);
  };

  const fields = [
    {
      label: 'Nome do produto',
      name: 'nome',
      value: values.nome,
      onChange: handleChange,
      placeholder: 'Ex.: Caneca personalizada',
      required: true,
    },
    {
      label: 'Preço (MZN)',
      name: 'preco',
      value: values.preco,
      onChange: handleChange,
      type: 'number',
      min: '0',
      step: '0.01',
      placeholder: '0,00',
      required: true,
    },
    {
      label: 'Descrição',
      name: 'descricao',
      value: values.descricao,
      onChange: handleChange,
      placeholder: 'Descrição do produto',
      required: true,
    },
    {
      label: 'Data de criação',
      name: 'data_criacao',
      value: values.data_criacao,
      onChange: handleChange,
      type: 'date',
      required: true,
    },
  ];

  return (
    <div className="card mx-auto w-full max-w-4xl">
      <div className="card-header">
        <h2 className="text-sm font-semibold text-neutral-800">{title}</h2>
        <span className="text-xs text-neutral-500">* Campos obrigatórios</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-5">
        {error && <ErrorBanner message={error} />}

        <InputGroup inputs={fields} />

        <div className="flex flex-wrap justify-end gap-2 border-t border-neutral-200 pt-5">
          <Link to="/produtos/list" className="btn btn-secondary">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'A guardar...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
