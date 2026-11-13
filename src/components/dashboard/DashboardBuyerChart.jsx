import React, { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { genderBreakdown } from '../../lib/stats';
import { formatNumber } from '../../lib/format';
import { tooltipStyle, useChartTheme } from '../../lib/theme';
import { ChartCardSkeleton } from '../ui/Skeleton';

/** Cor de cada género no tema atual. */
export const genderColors = (theme) => ({ F: theme.female, M: theme.male });

export default function DashboardBuyerChart({ orders = [], loading = false }) {
  const theme = useChartTheme();
  const colors = genderColors(theme);
  const entries = useMemo(() => genderBreakdown(orders), [orders]);
  const total = entries.reduce((sum, entry) => sum + entry.orders, 0);

  if (loading) return <ChartCardSkeleton bars={2} />;

  return (
    <div className="card flex h-full flex-col p-4 sm:p-5">
      <div className="mb-2">
        <h2 className="text-base font-semibold text-neutral-900">Perfil de compras</h2>
        <p className="text-sm text-neutral-600">Encomendas por género de quem compra.</p>
      </div>

      {total === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-600">
          Ainda não há encomendas com o género preenchido.
        </p>
      ) : (
        <>
          <div className="h-52 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={entries}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={2}
                  dataKey="orders"
                  nameKey="label"
                  isAnimationActive={false}
                >
                  {entries.map((entry) => (
                    <Cell key={entry.key} fill={colors[entry.key]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${formatNumber(value)} encomendas`, name]}
                  contentStyle={tooltipStyle(theme)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="mt-2 grid grid-cols-2 gap-3 border-t border-neutral-200 pt-4">
            {entries.map((entry) => (
              <li key={entry.key} className="text-center">
                <p className="flex items-center justify-center gap-2 text-sm text-neutral-700">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: colors[entry.key] }}
                    aria-hidden="true"
                  />
                  {entry.label}
                </p>
                <p className="text-lg font-semibold text-neutral-900">
                  {Math.round((entry.orders / total) * 100)}%
                </p>
                <p className="text-sm text-neutral-600">{formatNumber(entry.orders)} encomendas</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
