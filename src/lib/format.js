const currencyFormatter = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'MZN',
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('pt-PT', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function formatCurrency(value) {
  const number = Number(value);
  if (value === null || value === undefined || value === '' || Number.isNaN(number)) {
    return '—';
  }
  return currencyFormatter.format(number);
}

export function formatDate(value) {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return dateFormatter.format(date);
}

export function formatNumber(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return '—';
  return new Intl.NumberFormat('pt-PT').format(number);
}

export function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
