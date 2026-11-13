import React, { useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal';
import ErrorBanner from '../../components/ui/ErrorBanner';
import StatusBadge from '../../components/ui/StatusBadge';
import { STATUS_ICONS } from '../../components/ui/OrderStatusBadge';
import { ORDER_STATUS } from '../../lib/orderStatus';

/** Janela para mudar o estado de uma encomenda (com aviso sobre o efeito no stock). */
export default function EstadoModal({ order, saving = false, error = '', onSave, onClose }) {
  const [value, setValue] = useState(order?.estado ?? 'pendente');

  useEffect(() => {
    setValue(order?.estado ?? 'pendente');
  }, [order]);

  const cancelling = value === 'cancelada' && order?.estado !== 'cancelada';
  const reactivating = value !== 'cancelada' && order?.estado === 'cancelada';

  return (
    <Modal
      open={Boolean(order)}
      size="md"
      title="Atualizar estado"
      description={order ? `Encomenda #${order.id} · ${order.solicitante}` : ''}
      onClose={() => !saving && onClose()}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(value);
        }}
        className="space-y-4"
      >
        {error && <ErrorBanner message={error} />}

        <fieldset>
          <legend className="sr-only">Novo estado</legend>
          <div className="space-y-2">
            {ORDER_STATUS.map((status) => (
              <label
                key={status.key}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                  value === status.key ? 'border-purple-700 bg-purple-50' : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <input
                  type="radio"
                  name="estado"
                  value={status.key}
                  checked={value === status.key}
                  onChange={() => setValue(status.key)}
                  className="mt-1 h-4 w-4 accent-purple-700"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-medium text-neutral-900">
                    {React.createElement(STATUS_ICONS[status.key], { 'aria-hidden': true, className: 'text-lg' })}
                    {status.label}
                    {order?.estado === status.key && <StatusBadge status="Atual" tone="neutral" />}
                  </span>
                  <span className="text-sm text-neutral-600">{status.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {cancelling && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900" role="status">
            Ao cancelar, {order.quantidade} unidade(s) voltam ao stock do produto.
          </p>
        )}
        {reactivating && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900" role="status">
            Ao reativar, {order.quantidade} unidade(s) saem outra vez do stock.
          </p>
        )}

        <div className="flex justify-end gap-2 border-t border-neutral-200 pt-4">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving || value === order?.estado}>
            {saving ? 'A guardar...' : 'Guardar estado'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
