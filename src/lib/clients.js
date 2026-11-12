/**
 * Agrupa encomendas por cliente (campo `solicitante`).
 *
 * A API atual não expõe um recurso de clientes, por isso o diretório de
 * clientes é derivado das encomendas já registadas.
 */
export function groupOrdersByClient(orders = []) {
  const clients = new Map();

  for (const order of orders) {
    const nome = String(order.solicitante ?? '').trim() || 'Cliente sem nome';
    const key = nome.toLowerCase();
    const current = clients.get(key) ?? {
      id: nome,
      nome,
      encomendas: 0,
      total: 0,
      ultima: null,
    };

    current.encomendas += 1;
    current.total += Number(order.valor) || 0;

    const data = order.data_criacao ? new Date(order.data_criacao) : null;
    if (data && !Number.isNaN(data.getTime()) && (!current.ultima || data > current.ultima)) {
      current.ultima = data;
    }

    clients.set(key, current);
  }

  return [...clients.values()].sort((a, b) => b.total - a.total);
}
