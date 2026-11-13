import { useEffect, useMemo, useState } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { useSettings } from '../../lib/settings';

export const PAGE_SIZE = 10;

/**
 * Divide uma lista em páginas.
 * Volta à primeira página quando a lista muda de tamanho (ex.: pesquisa).
 */
export function usePagination(items, fixedSize) {
  const { settings } = useSettings();
  const pageSize = fixedSize ?? (Number(settings.porPagina) || PAGE_SIZE);
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, pageCount);

  useEffect(() => {
    setPage(1);
  }, [items.length]);

  const pageItems = useMemo(
    () => items.slice((current - 1) * pageSize, current * pageSize),
    [items, current, pageSize]
  );

  return { page: current, pageCount, pageItems, setPage, total: items.length, pageSize };
}

/** Números de página a mostrar, com reticências quando há muitas. */
function pageNumbers(page, pageCount) {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const numbers = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...numbers].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  return sorted.flatMap((n, index) => (index > 0 && n - sorted[index - 1] > 1 ? ['…', n] : [n]));
}

/** Rodapé de paginação; recebe o resultado de `usePagination`. */
export default function Pagination({ page, pageCount, setPage, total, pageSize = PAGE_SIZE }) {
  if (total <= pageSize) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 px-4 py-3 sm:px-5"
      aria-label="Paginação"
    >
      <p className="text-sm text-neutral-600">
        {first}–{last} de {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="btn btn-secondary px-2.5"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          aria-label="Página anterior"
        >
          <HiOutlineChevronLeft />
        </button>
        {pageNumbers(page, pageCount).map((item, index) =>
          item === '…' ? (
            <span key={`gap-${index}`} className="px-1 text-neutral-500">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => setPage(item)}
              aria-current={item === page ? 'page' : undefined}
              className={`btn min-w-9 px-2.5 ${item === page ? 'btn-primary' : 'btn-secondary'}`}
            >
              {item}
            </button>
          )
        )}
        <button
          type="button"
          className="btn btn-secondary px-2.5"
          onClick={() => setPage(page + 1)}
          disabled={page === pageCount}
          aria-label="Página seguinte"
        >
          <HiOutlineChevronRight />
        </button>
      </div>
    </nav>
  );
}
