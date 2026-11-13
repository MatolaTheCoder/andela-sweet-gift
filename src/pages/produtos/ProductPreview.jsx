import React from 'react';
import { HiOutlineCheckCircle, HiOutlineExclamation, HiOutlineExclamationCircle, HiOutlinePhotograph } from 'react-icons/hi';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../lib/format';
import { stockLevel } from '../../lib/orderStatus';

/** Cartão que mostra, em tempo real, como o produto vai aparecer. */
export default function ProductPreview({ values }) {
  const name = String(values.nome ?? '').trim();
  const stock = stockLevel({ stock: Number(values.stock) || 0, stock_minimo: Number(values.stock_minimo) || 0 });

  return (
    <div>
      <p className="label">Pré-visualização</p>
      <article className="overflow-hidden rounded-xl border border-neutral-200 bg-surface shadow-sm">
        <div className="aspect-[4/3] bg-neutral-100">
          {values.imagem ? (
            <img src={values.imagem} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-neutral-600">
              <HiOutlinePhotograph className="text-4xl" aria-hidden="true" />
              <span className="text-sm">Sem foto</span>
            </div>
          )}
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`min-w-0 break-words text-base font-semibold ${name ? 'text-neutral-900' : 'text-neutral-600'}`}>
              {name || 'Nome do produto'}
            </h3>
            <p className="shrink-0 text-base font-semibold text-neutral-900">
              {values.preco !== '' && values.preco != null ? formatCurrency(values.preco) : '—'}
            </p>
          </div>
          {values.categoria && <p className="text-sm text-neutral-600">{values.categoria}</p>}
          <p className="line-clamp-3 text-sm text-neutral-700">
            {values.descricao || 'A descrição aparece aqui.'}
          </p>
          <div className="pt-1">
            <StatusBadge
              status={`${stock.label} · ${Number(values.stock) || 0} un.`}
              tone={stock.tone}
              icon={stock.key === 'sem' ? HiOutlineExclamationCircle : stock.key === 'baixo' ? HiOutlineExclamation : HiOutlineCheckCircle}
            />
          </div>
        </div>
      </article>
      <p className="mt-1.5 text-sm text-neutral-600">É assim que o produto aparece na lista e nas encomendas.</p>
    </div>
  );
}
