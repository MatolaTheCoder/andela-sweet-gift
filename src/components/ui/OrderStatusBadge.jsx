import React from 'react';
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCube,
  HiOutlineExclamation,
  HiOutlineXCircle,
} from 'react-icons/hi';
import StatusBadge from './StatusBadge';
import { ORDER_STATUS, isOverdue } from '../../lib/orderStatus';

/** Cada estado tem o seu ícone: relógio, caixa, visto e cruz. */
export const STATUS_ICONS = {
  pendente: HiOutlineClock,
  preparacao: HiOutlineCube,
  entregue: HiOutlineCheckCircle,
  cancelada: HiOutlineXCircle,
};

/**
 * Estado da encomenda com cor e ícone. Se a entrega já devia ter sido feita,
 * junta um segundo selo vermelho "Atrasada".
 */
export default function OrderStatusBadge({ order }) {
  const status = ORDER_STATUS.find((item) => item.key === order?.estado) ?? ORDER_STATUS[0];
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <StatusBadge status={status.label} tone={status.tone} icon={STATUS_ICONS[status.key]} />
      {isOverdue(order) && <StatusBadge status="Atrasada" tone="danger" icon={HiOutlineExclamation} />}
    </span>
  );
}
