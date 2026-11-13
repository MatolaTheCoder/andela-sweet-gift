import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { HiOutlineSearch } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { getOrders, getProducts } from '../../lib/api';
import { useAuth } from '../../lib/auth';

const GROUPS = [
  { key: 'produto', label: 'Produtos' },
  { key: 'encomenda', label: 'Encomendas' },
  { key: 'cliente', label: 'Clientes' },
];
const PER_GROUP = 4;

const includes = (fields, term) => fields.some((field) => String(field ?? '').toLowerCase().includes(term));

/**
 * Pesquisa global: produtos, encomendas e clientes num só campo, com teclado
 * (setas, Enter, Esc) e o atalho Ctrl+K ou "/" para focar.
 */
export default function GlobalSearch() {
  const navigate = useNavigate();
  const { can } = useAuth();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);

  const load = () => {
    if (data) return;
    Promise.all([getProducts(), getOrders()])
      .then(([products, orders]) => setData({ products: products ?? [], orders: orders ?? [] }))
      .catch(() => setData({ products: [], orders: [] }));
  };

  useEffect(() => {
    const onKey = (event) => {
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      } else if (event.key === '/' && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase().replace(/^#/, '');
    if (!term || !data) return [];

    const products = can('produtos.ver')
      ? data.products
          .filter((p) => includes([p.nome, p.categoria, p.descricao, p.id], term))
          .slice(0, PER_GROUP)
          .map((p) => ({ key: `p${p.id}`, group: 'produto', label: p.nome, sub: p.categoria, to: `/produtos/list?q=${encodeURIComponent(p.nome)}` }))
      : [];

    const orders = can('encomendas.ver')
      ? data.orders
          .filter((o) => includes([o.id, o.solicitante, o.destinatario], term))
          .sort((a, b) => b.id - a.id)
          .slice(0, PER_GROUP)
          .map((o) => ({ key: `o${o.id}`, group: 'encomenda', label: `Encomenda #${o.id}`, sub: `${o.solicitante} → ${o.destinatario}`, to: `/encomendas/${o.id}/recibo` }))
      : [];

    const names = [...new Set(data.orders.map((o) => String(o.solicitante ?? '').trim()).filter(Boolean))];
    const clients = can('clientes.ver')
      ? names
          .filter((name) => name.toLowerCase().includes(term))
          .slice(0, PER_GROUP)
          .map((name) => ({ key: `c${name}`, group: 'cliente', label: name, sub: 'Ver detalhe do cliente', to: `/clientes/${encodeURIComponent(name)}` }))
      : [];

    return [...products, ...orders, ...clients];
  }, [query, data, can]);

  const select = (item) => {
    if (!item) return;
    setQuery('');
    inputRef.current?.blur();
    navigate(item.to);
  };

  return (
    <Combobox value={null} onChange={select} onClose={() => setQuery('')}>
      <div className="relative hidden max-w-md flex-1 sm:block">
        <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
        <ComboboxInput
          ref={inputRef}
          value={query}
          onFocus={load}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pesquisar produtos, encomendas, clientes..."
          aria-label="Pesquisa global"
          autoComplete="off"
          className="input h-9 pl-9 pr-14"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-neutral-300 px-1.5 text-xs text-neutral-600" aria-hidden="true">
          Ctrl K
        </kbd>

        {query.trim() && (
          <ComboboxOptions
            static
            className="absolute left-0 right-0 top-full z-40 mt-2 max-h-96 overflow-y-auto rounded-xl border border-neutral-200 bg-surface py-1 shadow-lg"
          >
            {!data ? (
              <p className="px-4 py-3 text-sm text-neutral-600">A pesquisar...</p>
            ) : results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-neutral-600">Sem resultados para “{query.trim()}”.</p>
            ) : (
              GROUPS.map((group) => {
                const items = results.filter((item) => item.group === group.key);
                if (items.length === 0) return null;
                return (
                  <div key={group.key}>
                    <p className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-neutral-600">{group.label}</p>
                    {items.map((item) => (
                      <ComboboxOption
                        key={item.key}
                        value={item}
                        className="cursor-pointer px-4 py-2 data-[focus]:bg-neutral-100"
                      >
                        <span className="block truncate text-sm font-medium text-neutral-900">{item.label}</span>
                        <span className="block truncate text-sm text-neutral-600">{item.sub}</span>
                      </ComboboxOption>
                    ))}
                  </div>
                );
              })
            )}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}
