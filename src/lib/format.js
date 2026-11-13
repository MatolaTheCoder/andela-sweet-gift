/** Os valores guardam-se sempre em MZN; as outras moedas usam taxas fixas de demonstração. */
export const CURRENCIES = [
  { code: 'MZN', label: 'Metical (MZN)', rate: 1 },
  { code: 'USD', label: 'Dólar (USD)', rate: 64 },
  { code: 'EUR', label: 'Euro (EUR)', rate: 70 },
];

const makeFormatter = (code) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: code, maximumFractionDigits: 2 });

let currentCurrency = CURRENCIES[0];
let currencyFormatter = makeFormatter('MZN');

/** Define a moeda de apresentação (chamado pelas Definições). */
export function setCurrency(code) {
  currentCurrency = CURRENCIES.find((item) => item.code === code) ?? CURRENCIES[0];
  currencyFormatter = makeFormatter(currentCurrency.code);
}

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
  return currencyFormatter.format(number / currentCurrency.rate);
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
