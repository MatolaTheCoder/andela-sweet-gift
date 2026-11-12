import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InputGroup from '../../components/ui/Input';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { getProducts } from '../../lib/api';

export default function EncomendaForm({
  title = 'Dados da encomenda',
  submitLabel = 'Registar encomenda',
  initialValues = {},
  loading = false,
  error = '',
  onSubmit,
}) {
  const [products, setProducts] = useState([]);
  const [values, setValues] = useState({
    solicitante: initialValues.solicitante ?? '',
    destinatario: initialValues.destinatario ?? '',
    id_produto: initialValues.id_produto ?? '',
    quantidade: initialValues.quantidade ?? 1,
    valor: initialValues.valor ?? '',
    endereco_destinatario: initialValues.endereco_destinatario ?? '',
    data_criacao: initialValues.data_criacao ?? new Date().toISOString().slice(0, 10),
    data_entrega: initialValues.data_entrega ?? new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data ?? []))
      .catch(() => setProducts([]));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((current) => {
      const next = { ...current, [name]: value };

      if (name === 'id_produto') {
        const selected = products.find((product) => String(product.id) === String(value));
        const quantidade = Number(next.quantidade) || 1;
        if (selected) {
          next.valor = (Number(selected.preco) * quantidade).toFixed(2);
        }
      }

      if (name === 'quantidade') {
        const selected = products.find((product) => String(product.id) === String(next.id_produto));
        if (selected) {
          next.valor = (Number(selected.preco) * (Number(value) || 1)).toFixed(2);
        }
      }

      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(values);
  };

  const fields = [
    {
      label: 'Solicitante',
      name: 'solicitante',
      value: values.solicitante,
      onChange: handleChange,
      placeholder: 'Nome de quem encomenda',
      required: true,
    },
    {
      label: 'Destinatário',
      name: 'destinatario',
      value: values.destinatario,
      onChange: handleChange,
      placeholder: 'Nome de quem recebe',
      required: true,
    },
    {
      label: 'Produto',
      name: 'id_produto',
      value: values.id_produto,
      onChange: handleChange,
      required: true,
      options: products.map((product) => ({ value: product.id, label: product.nome })),
    },
    {
      label: 'Quantidade',
      name: 'quantidade',
      value: values.quantidade,
      onChange: handleChange,
      type: 'number',
      min: '1',
      required: true,
    },
    {
      label: 'Valor (MZN)',
      name: 'valor',
      value: values.valor,
      onChange: handleChange,
      type: 'number',
      min: '0',
      step: '0.01',
      required: true,
    },
    {
      label: 'Endereço de entrega',
      name: 'endereco_destinatario',
      value: values.endereco_destinatario,
      onChange: handleChange,
      placeholder: 'Rua, bairro, cidade',
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
    {
      label: 'Data de entrega',
      name: 'data_entrega',
      value: values.data_entrega,
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
          <Link to="/encomendas/list" className="btn btn-secondary">
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
