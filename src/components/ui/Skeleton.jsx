import React from 'react';

/**
 * Blocos de carregamento ("skeleton"). Têm a forma do conteúdo final para a página
 * não saltar quando os dados chegam. São decorativos (aria-hidden): quem usa deve
 * marcar a região com aria-busy.
 */
export function Skeleton({ className = '', light = false }) {
  return (
    <div
      className={`animate-pulse rounded ${light ? 'bg-white/20' : 'bg-neutral-200'} ${className}`}
      aria-hidden="true"
    />
  );
}

/** Linhas de tabela: `widths` é uma classe de largura por coluna (ex.: ['w-10', 'w-48']). */
export function SkeletonRows({ widths = [], rows = 6, lastRight = false }) {
  return Array.from({ length: rows }, (_, row) => (
    <tr key={`skeleton-${row}`} aria-hidden="true">
      {widths.map((width, column) => (
        <td key={column} className="td">
          <Skeleton
            className={`h-4 ${width} ${lastRight && column === widths.length - 1 ? 'ml-auto' : ''}`}
          />
        </td>
      ))}
    </tr>
  ));
}

/** Cartão com título e um gráfico de barras fantasma. */
export function ChartCardSkeleton({ bars = 12, height = 'h-64' }) {
  const heights = ['h-1/3', 'h-1/2', 'h-2/3', 'h-5/6', 'h-2/5', 'h-3/5'];
  return (
    <div className="card flex h-full flex-col p-4 sm:p-5" aria-busy="true">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-2 h-4 w-64 max-w-full" />
      <div className={`mt-6 flex ${height} items-end gap-2`}>
        {Array.from({ length: bars }, (_, index) => (
          <Skeleton key={index} className={`flex-1 ${heights[index % heights.length]}`} />
        ))}
      </div>
    </div>
  );
}

/** Cartão com título e linhas de texto. */
export function CardSkeleton({ lines = 4 }) {
  return (
    <div className="card p-4 sm:p-5" aria-busy="true">
      <Skeleton className="h-5 w-40" />
      <div className="mt-5 space-y-4">
        {Array.from({ length: lines }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
