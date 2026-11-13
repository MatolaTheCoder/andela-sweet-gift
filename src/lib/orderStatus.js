/** Estados de uma encomenda, pela ordem do fluxo normal. */
export const ORDER_STATUS = [
  { key: 'pendente', label: 'Pendente', tone: 'warning', hint: 'Registada, ainda por iniciar.' },
  { key: 'preparacao', label: 'Em preparação', tone: 'info', hint: 'A ser preparada para entrega.' },
  { key: 'entregue', label: 'Entregue', tone: 'success', hint: 'Entregue ao destinatário.' },
  { key: 'cancelada', label: 'Cancelada', tone: 'danger', hint: 'Anulada; o stock volta ao armazém.' },
];

export const statusOf = (order) =>
  ORDER_STATUS.find((status) => status.key === order?.estado) ?? ORDER_STATUS[0];

/** Encomenda que ainda precisa de ser tratada. */
export const isOpen = (order) => order?.estado === 'pendente' || order?.estado === 'preparacao';

export const isoToday = () => {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/** Entrega por fazer cuja data já passou. */
export const isOverdue = (order, today = isoToday()) =>
  isOpen(order) && Boolean(order.data_entrega) && order.data_entrega < today;

export const isDueToday = (order, today = isoToday()) =>
  isOpen(order) && order.data_entrega === today;

/** Próximo passo natural do fluxo (para o botão "Avançar"). */
export const nextStatus = (order) => {
  if (order?.estado === 'pendente') return ORDER_STATUS[1];
  if (order?.estado === 'preparacao') return ORDER_STATUS[2];
  return null;
};

/** Estado de stock de um produto. */
export const stockLevel = (product) => {
  const stock = Number(product?.stock) || 0;
  if (stock <= 0) return { key: 'sem', label: 'Sem stock', tone: 'danger' };
  if (stock <= (Number(product?.stock_minimo) || 0)) return { key: 'baixo', label: 'Stock baixo', tone: 'warning' };
  return { key: 'ok', label: 'Em stock', tone: 'success' };
};
