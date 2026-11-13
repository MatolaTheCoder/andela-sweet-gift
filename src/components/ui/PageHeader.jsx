import React from 'react';

/**
 * Cabeçalho de página.
 *
 * - `default`: cartão branco, usado na maioria das páginas.
 * - `hero`: bloco roxo escuro com texto claro, exclusivo do Dashboard.
 *   Aceita `children` para mostrar indicadores resumidos.
 */
export default function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  variant = 'default',
  children,
}) {
  const hero = variant === 'hero';

  return (
    <header
      className={
        'no-print ' +
        (hero
          ? 'relative overflow-hidden rounded-xl border border-purple-900 bg-linear-to-br from-purple-950 via-purple-900 to-purple-800 px-5 py-6 text-white sm:px-8 sm:py-8'
          : 'mb-5 rounded-xl border border-neutral-200 bg-surface px-5 py-4 shadow-sm')
      }
    >
      {hero && (
        <>
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-purple-700/40"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 right-40 h-56 w-56 rounded-full bg-purple-600/20"
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          {breadcrumb && (
            <p
              className={`mb-1 text-xs font-semibold uppercase tracking-wider ${
                hero ? 'text-[#e9d5ff]' : 'text-neutral-600'
              }`}
            >
              {breadcrumb}
            </p>
          )}
          <h1
            className={`truncate font-semibold tracking-tight ${
              hero ? 'text-3xl text-white' : 'text-2xl text-neutral-900'
            }`}
          >
            {title}
          </h1>
          {description && (
            <p className={`mt-1 text-base ${hero ? 'text-[#f3e8ff]' : 'text-neutral-600'}`}>
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>

      {children && <div className="relative mt-6">{children}</div>}
    </header>
  );
}
