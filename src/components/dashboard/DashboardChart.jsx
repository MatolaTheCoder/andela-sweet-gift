import React, { useMemo } from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { HiArrowSmDown, HiArrowSmUp } from 'react-icons/hi';
import { MOCK_PREVIOUS_YEAR_SALES } from '../../lib/mockData';
import { MONTHS, pctChange, salesByMonth } from '../../lib/stats';
import { formatCurrency } from '../../lib/format';
import { tooltipStyle, useChartTheme } from '../../lib/theme';
import { ChartCardSkeleton } from '../ui/Skeleton';

const sum = (values) => values.reduce((total, value) => total + value, 0);

function Change({ value }) {
  if (value === null) return <span className="text-sm text-neutral-600">sem comparação</span>;
  const up = value >= 0;
  const Icon = up ? HiArrowSmUp : HiArrowSmDown;
  return (
    <span className={`inline-flex items-center text-sm font-medium ${up ? 'text-emerald-700' : 'text-rose-700'}`}>
      <Icon aria-hidden="true" />
      {Math.abs(value).toFixed(1)}%<span className="sr-only">{up ? ' a subir' : ' a descer'}</span>
    </span>
  );
}

function Figure({ label, value, change, color }) {
  return (
    <div className="px-2 text-center">
      <p className="flex items-center justify-center gap-2 text-sm text-neutral-700">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 flex flex-wrap items-center justify-center gap-x-2 text-lg font-semibold text-neutral-900">
        {value}
        {change !== undefined && <Change value={change} />}
      </p>
    </div>
  );
}

export default function DashboardChart({ orders = [], loading = false }) {
  const theme = useChartTheme();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const { data, thisMonth, monthChange, thisYear, yearChange, previousYear } = useMemo(() => {
    const current = salesByMonth(orders, year);
    const previous = MOCK_PREVIOUS_YEAR_SALES;
    const data = MONTHS.map((name, index) => ({
      name,
      atual: index <= month ? current[index] : null,
      anterior: previous[index],
      meta: Math.round(previous[index] * 1.08),
    }));
    return {
      data,
      thisMonth: current[month],
      monthChange: pctChange(current[month], month > 0 ? current[month - 1] : previous[11]),
      thisYear: sum(current.slice(0, month + 1)),
      yearChange: pctChange(sum(current.slice(0, month + 1)), sum(previous.slice(0, month + 1))),
      previousYear: sum(previous),
    };
  }, [orders, year, month]);

  if (loading) return <ChartCardSkeleton />;

  return (
    <div className="card flex h-full flex-col">
      <div className="px-4 pt-4 sm:px-5 sm:pt-5">
        <h2 className="text-base font-semibold text-neutral-900">Vendas por mês</h2>
        <p className="text-sm text-neutral-600">
          Valor das encomendas de {year} comparado com {year - 1} (MZN).
        </p>
      </div>

      <div className="h-72 w-full min-w-0 px-2 pt-4 sm:px-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={theme.grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 13, fill: theme.tick }} stroke={theme.axis} tickLine={false} />
            <YAxis
              tick={{ fontSize: 13, fill: theme.tick }}
              tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
              stroke={theme.axis}
              tickLine={false}
              axisLine={false}
              width={44}
            />
            <Tooltip
              cursor={{ fill: theme.cursor }}
              formatter={(value, name) => [formatCurrency(value), name]}
              contentStyle={tooltipStyle(theme)}
            />
            <Area
              dataKey="meta"
              name="Meta"
              type="monotone"
              stroke="none"
              fill={theme.area}
              fillOpacity={0.9}
              isAnimationActive={false}
            />
            <Bar dataKey="atual" name={`${year}`} fill={theme.primary} radius={[4, 4, 0, 0]} maxBarSize={22} isAnimationActive={false} />
            <Line
              dataKey="anterior"
              name={`${year - 1}`}
              type="monotone"
              stroke={theme.previous}
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-auto grid grid-cols-1 gap-4 border-t border-neutral-200 px-4 py-4 sm:grid-cols-3 sm:px-5">
        <Figure label="Este mês" value={formatCurrency(thisMonth)} change={monthChange} color={theme.primary} />
        <Figure label="Este ano" value={formatCurrency(thisYear)} change={yearChange} color={theme.primary} />
        <Figure label="Ano anterior" value={formatCurrency(previousYear)} color={theme.previous} />
      </div>
    </div>
  );
}
