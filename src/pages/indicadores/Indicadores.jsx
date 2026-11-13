import React, { useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import PageHeader from '../../components/ui/PageHeader';
import { HiOutlinePrinter } from 'react-icons/hi';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { CardSkeleton, Skeleton } from '../../components/ui/Skeleton';
import { genderColors } from '../../components/dashboard/DashboardBuyerChart';
import { getErrorMessage, getOrders, getProducts } from '../../lib/api';
import { formatCurrency, formatNumber } from '../../lib/format';
import { useSettings } from '../../lib/settings';
import { tooltipStyle, useChartTheme } from '../../lib/theme';
import {
  PERIODS,
  ageBreakdown,
  categoryBreakdown,
  filterByPeriod,
  genderBreakdown,
  productBreakdown,
  summary,
} from '../../lib/stats';

const METRICS = [
  { key: 'orders', label: 'Nº de encomendas', format: (value) => formatNumber(value) },
  { key: 'valor', label: 'Valor (MZN)', format: (value) => formatCurrency(value) },
];

/** Lista de barras horizontais: o valor aparece sempre em texto, a barra é só reforço visual. */
function BarList({ items, metric, color, empty = 'Sem dados neste período.' }) {
  const max = Math.max(...items.map((item) => item[metric.key]), 0);
  const total = items.reduce((sum, item) => sum + item[metric.key], 0);

  if (items.length === 0 || total === 0) {
    return <p className="py-10 text-center text-sm text-neutral-600">{empty}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.key}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate font-medium text-neutral-800">{item.label}</span>
            <span className="shrink-0 text-neutral-700">
              {metric.format(item[metric.key])}{' '}
              <span className="text-neutral-600">({Math.round((item[metric.key] / total) * 100)}%)</span>
            </span>
          </div>
          <div className="print-exact h-2.5 rounded-full bg-neutral-100" aria-hidden="true">
            <div
              className="print-exact h-full rounded-full"
              style={{ width: `${max ? (item[metric.key] / max) * 100 : 0}%`, backgroundColor: color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Panel({ title, description, children }) {
  return (
    <section className="card break-inside-avoid p-4 sm:p-5">
      <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
      {description && <p className="mb-4 text-sm text-neutral-600">{description}</p>}
      {children}
    </section>
  );
}

function Kpi({ label, value, hint }) {
  return (
    <div className="card break-inside-avoid p-4">
      <p className="text-sm font-medium text-neutral-700">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
      <p className="mt-0.5 text-sm text-neutral-600">{hint}</p>
    </div>
  );
}

export default function Indicadores() {
  const { settings } = useSettings();
  const theme = useChartTheme();
  const colors = genderColors(theme);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('ano');
  const [metricKey, setMetricKey] = useState('orders');

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([getOrders(), getProducts()])
      .then(([orderList, productList]) => {
        setOrders(orderList ?? []);
        setProducts(productList ?? []);
      })
      .catch((requestError) =>
        setError(getErrorMessage(requestError, 'Não foi possível carregar os indicadores.'))
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const metric = METRICS.find((item) => item.key === metricKey);
  const scoped = useMemo(() => filterByPeriod(orders, period), [orders, period]);
  const kpis = useMemo(() => summary(scoped), [scoped]);
  const ages = useMemo(() => ageBreakdown(scoped), [scoped]);
  const genders = useMemo(() => genderBreakdown(scoped), [scoped]);
  const categories = useMemo(() => categoryBreakdown(scoped, products), [scoped, products]);
  const topProducts = useMemo(() => productBreakdown(scoped, products).slice(0, 5), [scoped, products]);
  const genderTotal = genders.reduce((sum, entry) => sum + entry[metric.key], 0);

  return (
    <div>
      <PageHeader
        breadcrumb="Análise"
        title="Indicadores"
        description="Quem compra, o que compra e quanto: idade, género e categorias."
        actions={
          <button type="button" className="btn btn-primary" onClick={() => window.print()} disabled={loading}>
            <HiOutlinePrinter aria-hidden="true" /> Imprimir relatório
          </button>
        }
      />

      {/* Cabeçalho que só aparece na folha impressa. */}
      <div className="mb-4 hidden border-b-2 border-neutral-900 pb-3 print:block" aria-hidden="true">
        <h1 className="text-2xl font-bold text-neutral-900">Relatório de indicadores</h1>
        <p className="text-sm text-neutral-700">
          {settings.empresa} · {PERIODS.find((item) => item.key === period)?.label} · medido por {metric.label} ·
          gerado em {new Date().toLocaleDateString('pt-PT')}
        </p>
      </div>

      <ErrorBanner message={error} onRetry={load} />

      {!error && (
        <div className="flex flex-col gap-5">
          <div className="card no-print flex flex-wrap items-end gap-4 p-4">
            <div>
              <label htmlFor="periodo" className="label">
                Período
              </label>
              <select
                id="periodo"
                className="input w-auto min-w-48"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
              >
                {PERIODS.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <fieldset>
              <legend className="label">Medir por</legend>
              <div className="flex gap-2">
                {METRICS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    aria-pressed={metricKey === item.key}
                    onClick={() => setMetricKey(item.key)}
                    className={`btn ${metricKey === item.key ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <p className="ml-auto text-sm text-neutral-600" aria-live="polite">
              {loading ? 'A carregar...' : `${formatNumber(scoped.length)} encomendas analisadas`}
            </p>
          </div>

          {loading ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="card space-y-2 p-4">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-7 w-24" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2" aria-busy="true">
                {[0, 1, 2, 3].map((item) => (
                  <CardSkeleton key={item} lines={5} />
                ))}
              </div>
            </>
          ) : (
            <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Ticket médio" value={formatCurrency(kpis.ticket)} hint="Valor médio por encomenda" />
            <Kpi
              label="Clientes recorrentes"
              value={`${Math.round(kpis.recurringRate)}%`}
              hint="Compraram mais de uma vez"
            />
            <Kpi
              label="Prazo de entrega"
              value={`${kpis.deliveryDays.toFixed(1)} dias`}
              hint="Da encomenda à entrega"
            />
            <Kpi
              label="Idade média"
              value={kpis.averageAge ? `${Math.round(kpis.averageAge)} anos` : '—'}
              hint="De quem encomenda"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <Panel title="Idade" description={`${metric.label} por faixa etária.`}>
              <BarList items={ages} metric={metric} color={theme.primary} />
            </Panel>

            <Panel title="Género" description={`${metric.label} por género.`}>
              {genderTotal === 0 ? (
                <p className="py-10 text-center text-sm text-neutral-600">Sem dados neste período.</p>
              ) : (
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <div className="h-44 w-44 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genders}
                          dataKey={metric.key}
                          nameKey="label"
                          innerRadius={44}
                          outerRadius={72}
                          paddingAngle={2}
                          isAnimationActive={false}
                        >
                          {genders.map((entry) => (
                            <Cell key={entry.key} fill={colors[entry.key]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [metric.format(value), name]}
                          contentStyle={tooltipStyle(theme)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="w-full space-y-3">
                    {genders.map((entry) => (
                      <li key={entry.key} className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2 font-medium text-neutral-800">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: colors[entry.key] }}
                            aria-hidden="true"
                          />
                          {entry.label}
                        </span>
                        <span className="text-neutral-700">
                          {metric.format(entry[metric.key])}{' '}
                          <span className="text-neutral-600">
                            ({Math.round((entry[metric.key] / genderTotal) * 100)}%)
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Panel>

            <Panel title="Categorias de produto" description={`${metric.label} por categoria.`}>
              <BarList items={categories} metric={metric} color={theme.category} />
            </Panel>

            <Panel title="Produtos mais vendidos" description="Top 5 por unidades vendidas.">
              <BarList
                items={topProducts}
                metric={{ key: 'orders', format: (value) => `${formatNumber(value)} un.` }}
                color={theme.product}
              />
            </Panel>
          </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
