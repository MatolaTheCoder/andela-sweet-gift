import React, { useState } from 'react';
import InputGroup from '../../components/ui/Input';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { PRODUCT_CATEGORIES } from '../../lib/mockData';
import ProductImageField from './ProductImageField';
import ProductPreview from './ProductPreview';

export default function ProdutoForm({
  submitLabel = 'Registar produto',
  initialValues = {},
  loading = false,
  error = '',
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState({
    nome: initialValues.nome ?? '',
    descricao: initialValues.descricao ?? '',
    preco: initialValues.preco ?? '',
    categoria: initialValues.categoria ?? '',
    stock: initialValues.stock ?? 0,
    stock_minimo: initialValues.stock_minimo ?? 5,
    imagem: initialValues.imagem ?? '',
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
      label: 'Categoria',
      name: 'categoria',
      value: values.categoria,
      onChange: handleChange,
      required: true,
      options: PRODUCT_CATEGORIES.map((category) => ({ value: category, label: category })),
    },
    {
      label: 'Data de criação',
      name: 'data_criacao',
      value: values.data_criacao,
      onChange: handleChange,
      type: 'date',
      required: true,
    },
    {
      label: 'Stock (unidades)',
      name: 'stock',
      value: values.stock,
      onChange: handleChange,
      type: 'number',
      min: '0',
      step: '1',
      required: true,
    },
    {
      label: 'Avisar quando restarem',
      name: 'stock_minimo',
      value: values.stock_minimo,
      onChange: handleChange,
      type: 'number',
      min: '0',
      step: '1',
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
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorBanner message={error} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_17rem]">
        <div className="space-y-4">
          <InputGroup inputs={fields} />
          <ProductImageField
            value={values.imagem}
            onChange={(imagem) => setValues((current) => ({ ...current, imagem }))}
          />
        </div>
        <ProductPreview values={values} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-5">
        <span className="text-sm text-neutral-600">* Campos obrigatórios</span>
        <div className="flex gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'A guardar...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
