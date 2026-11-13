/** Cálculos de indicadores a partir de encomendas e produtos. */

export const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const num = (value) => Number(value) || 0;

/** Encomendas canceladas não contam para vendas nem indicadores. */
const live = (orders) => orders.filter((order) => order.estado !== 'cancelada');

const dateOf = (order) => {
  const date = new Date(order.data_criacao);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Soma do valor das encomendas por mês de um ano (12 posições). */
export function salesByMonth(orders, year) {
  orders = live(orders);
  const totals = Array(12).fill(0);
  orders.forEach((order) => {
    const date = dateOf(order);
    if (date && date.getFullYear() === year) totals[date.getMonth()] += num(order.valor);
  });
  return totals;
}

/** Variação percentual; `null` quando não há base de comparação. */
export function pctChange(current, previous) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

export const PERIODS = [
  { key: 'ano', label: 'Este ano' },
  { key: '90', label: 'Últimos 90 dias' },
  { key: 'tudo', label: 'Todo o período' },
];

export function filterByPeriod(orders, period) {
  if (period === 'tudo') return orders;
  const now = new Date();
  return orders.filter((order) => {
    const date = dateOf(order);
    if (!date) return false;
    if (period === 'ano') return date.getFullYear() === now.getFullYear();
    return (now - date) / 86400000 <= 90;
  });
}

const emptyEntry = (key, label) => ({ key, label, orders: 0, valor: 0 });
const add = (entry, order) => {
  entry.orders += 1;
  entry.valor += num(order.valor);
};

export const GENDERS = [
  { key: 'F', label: 'Mulheres' },
  { key: 'M', label: 'Homens' },
];

export function genderBreakdown(orders) {
  orders = live(orders);
  const entries = GENDERS.map(({ key, label }) => emptyEntry(key, label));
  orders.forEach((order) => {
    const entry = entries.find((item) => item.key === order.genero);
    if (entry) add(entry, order);
  });
  return entries;
}

const AGE_BANDS = [
  { key: '18-24', min: 0, max: 24 },
  { key: '25-34', min: 25, max: 34 },
  { key: '35-44', min: 35, max: 44 },
  { key: '45-54', min: 45, max: 54 },
  { key: '55+', min: 55, max: 200 },
];

export function ageBreakdown(orders) {
  orders = live(orders);
  const entries = AGE_BANDS.map(({ key }) => emptyEntry(key, `${key} anos`));
  orders.forEach((order) => {
    const age = Number(order.idade);
    if (!age) return;
    const index = AGE_BANDS.findIndex((band) => age >= band.min && age <= band.max);
    if (index >= 0) add(entries[index], order);
  });
  return entries;
}

export function categoryBreakdown(orders, products) {
  orders = live(orders);
  const byProduct = new Map(products.map((product) => [String(product.id), product]));
  const entries = new Map();
  orders.forEach((order) => {
    const category = byProduct.get(String(order.id_produto))?.categoria || 'Sem categoria';
    if (!entries.has(category)) entries.set(category, emptyEntry(category, category));
    add(entries.get(category), order);
  });
  return [...entries.values()].sort((a, b) => b.valor - a.valor);
}

export function productBreakdown(orders, products) {
  orders = live(orders);
  const entries = new Map();
  products.forEach((product) => entries.set(String(product.id), emptyEntry(String(product.id), product.nome)));
  orders.forEach((order) => {
    const entry = entries.get(String(order.id_produto));
    if (entry) {
      entry.orders += num(order.quantidade) || 1;
      entry.valor += num(order.valor);
    }
  });
  return [...entries.values()].filter((entry) => entry.orders > 0).sort((a, b) => b.orders - a.orders);
}

/** Indicadores simples: ticket médio, recorrência, prazo de entrega e idade média. */
export function summary(orders) {
  orders = live(orders);
  const total = orders.reduce((sum, order) => sum + num(order.valor), 0);
  const perClient = new Map();
  let days = 0;
  let daysCount = 0;
  let ages = 0;
  let agesCount = 0;

  orders.forEach((order) => {
    const key = String(order.solicitante ?? '').trim().toLowerCase();
    if (key) perClient.set(key, (perClient.get(key) ?? 0) + 1);

    const created = dateOf(order);
    const delivery = new Date(order.data_entrega);
    if (created && !Number.isNaN(delivery.getTime())) {
      days += Math.max(0, (delivery - created) / 86400000);
      daysCount += 1;
    }
    if (Number(order.idade)) {
      ages += Number(order.idade);
      agesCount += 1;
    }
  });

  const clients = perClient.size;
  const recurring = [...perClient.values()].filter((count) => count > 1).length;

  return {
    orders: orders.length,
    ticket: orders.length ? total / orders.length : 0,
    recurringRate: clients ? (recurring / clients) * 100 : 0,
    deliveryDays: daysCount ? days / daysCount : 0,
    averageAge: agesCount ? ages / agesCount : 0,
  };
}
