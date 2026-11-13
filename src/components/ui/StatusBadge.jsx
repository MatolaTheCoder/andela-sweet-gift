import React from 'react';

const TONES = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-rose-50 text-rose-700 ring-rose-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
  neutral: 'bg-neutral-50 text-neutral-600 ring-neutral-200',
  brand: 'bg-purple-50 text-purple-700 ring-purple-200',
};

const STATUS_TONES = {
  pago: 'success',
  concluido: 'success',
  entregue: 'success',
  pendente: 'warning',
  emprocessamento: 'warning',
  processamento: 'warning',
  falhado: 'danger',
  cancelado: 'danger',
  cancelada: 'danger',
  registada: 'brand',
  registado: 'brand',
};

const LABELS = {
  emprocessamento: 'Em processamento',
  processamento: 'Em processamento',
  cancelada: 'Cancelada',
  registada: 'Registada',
  registado: 'Registado',
};

export default function StatusBadge({ status, tone, icon: Icon }) {
  const key = String(status ?? '').toLowerCase().replace(/[\s_-]+/g, '');
  const variant = TONES[tone ?? STATUS_TONES[key] ?? 'neutral'];
  const label = LABELS[key] ?? (status ? String(status) : '—');

  return (
    <span className={`chip ${variant}`}>
      {Icon && <Icon aria-hidden="true" className="text-sm" />}
      {label}
    </span>
  );
}
