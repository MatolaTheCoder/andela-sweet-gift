import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import ErrorBanner from '../../components/ui/ErrorBanner';
import OrderStatusBadge from '../../components/ui/OrderStatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { getErrorMessage, getOrders, getProducts, updateOrderStatus } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { formatCurrency } from '../../lib/format';
import { isOverdue, isoToday, nextStatus, statusOf } from '../../lib/orderStatus';

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const pad = (value) => String(value).padStart(2, '0');
const isoOf = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const fromIso = (iso) => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
};
const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};
/** Segunda-feira da semana da data. */
const startOfWeek = (date) => addDays(date, -((date.getDay() + 6) % 7));

const longDay = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'full' });
const monthTitle = new Intl.DateTimeFormat('pt-PT', { month: 'long', year: 'numeric' });
const upperFirst = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const shortDay = new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short' });

const CHIP = {
  pendente: 'bg-amber-50 text-amber-700 ring-amber-200',
  preparacao: 'bg-sky-50 text-sky-700 ring-sky-200',
  entregue: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  atraso: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export default function Calendario() {
  const { can } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('mes');
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(isoToday());
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    Promise.all([getOrders(), getProducts()])
      .then(([orderList, productList]) => {
        setOrders(orderList ?? []);
        setProducts(productList ?? []);
      })
      .catch((requestError) => setError(getErrorMessage(requestError, 'Não foi possível carregar o calendário.')))
      .finally(() => setLoading(false));
  }, []);

  const productNames = useMemo(() => new Map(products.map((product) => [String(product.id), product.nome])), [products]);

  const byDay = useMemo(() => {
    const map = new Map();
    orders
      .filter((order) => order.estado !== 'cancelada' && order.data_entrega)
      .forEach((order) => map.set(order.data_entrega, [...(map.get(order.data_entrega) ?? []), order]));
    return map;
  }, [orders]);

  const days = useMemo(() => {
    if (view === 'semana') {
      const start = startOfWeek(cursor);
      return Array.from({ length: 7 }, (_, index) => addDays(start, index));
    }
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = startOfWeek(first);
    const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const total = Math.ceil(((last - start) / 86400000 + 1) / 7) * 7;
    return Array.from({ length: total }, (_, index) => addDays(start, index));
  }, [view, cursor]);

  const move = (direction) =>
    setCursor((current) =>
      view === 'semana'
        ? addDays(current, direction * 7)
        : new Date(current.getFullYear(), current.getMonth() + direction, 1)
    );

  const title =
    view === 'semana'
      ? `${shortDay.format(days[0])} – ${shortDay.format(days[6])} ${days[6].getFullYear()}`
      : upperFirst(monthTitle.format(cursor));

  const advance = async (order) => {
    const next = nextStatus(order);
    if (!next) return;
    setBusyId(order.id);
    try {
      const updated = await updateOrderStatus(order.id, next.key);
      setOrders((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Não foi possível atualizar o estado.'));
    } finally {
      setBusyId(null);
    }
  };

  const chipTone = (order) => (isOverdue(order) ? 'atraso' : order.estado);
  const dayOrders = byDay.get(selected) ?? [];
  const todayIso = isoToday();

  return (
    <div>
      <PageHeader
        breadcrumb="Encomendas"
        title="Calendário de entregas"
        description="Planeie o dia e a semana: cada encomenda aparece na data de entrega."
      />

      <ErrorBanner message={error} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_22rem]">
        <section className="card min-w-0" aria-busy={loading}>
          <div className="card-header">
            <div className="flex items-center gap-2">
              <button type="button" className="btn btn-secondary px-2" onClick={() => move(-1)} aria-label="Anterior">
                <HiOutlineChevronLeft aria-hidden="true" />
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => { setCursor(new Date()); setSelected(todayIso); }}>
                Hoje
              </button>
              <button type="button" className="btn btn-secondary px-2" onClick={() => move(1)} aria-label="Seguinte">
                <HiOutlineChevronRight aria-hidden="true" />
              </button>
              <h2 className="ml-2 text-base font-semibold text-neutral-900" aria-live="polite">
                {title}
              </h2>
            </div>
            <div className="flex gap-2" role="group" aria-label="Vista">
              {[['mes', 'Mês'], ['semana', 'Semana']].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={view === key}
                  onClick={() => setView(key)}
                  className={`btn ${view === key ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto p-2 sm:p-3">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-7 gap-1 pb-1 text-center text-sm font-semibold text-neutral-700">
                {WEEKDAYS.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              {loading ? (
                <Skeleton className="h-96 w-full" />
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {days.map((date) => {
                    const iso = isoOf(date);
                    const items = byDay.get(iso) ?? [];
                    const inMonth = view === 'semana' || date.getMonth() === cursor.getMonth();
                    const limit = view === 'semana' ? 12 : 3;
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => setSelected(iso)}
                        aria-pressed={selected === iso}
                        className={`flex flex-col gap-1 rounded-lg border p-1.5 text-left transition-colors ${
                          view === 'semana' ? 'min-h-64' : 'min-h-24'
                        } ${
                          selected === iso
                            ? 'border-purple-700 bg-purple-50'
                            : 'border-neutral-200 hover:bg-neutral-50'
                        } ${inMonth ? '' : 'bg-neutral-50'}`}
                      >
                        <span className="sr-only">
                          {longDay.format(date)}, {items.length} entrega(s).
                        </span>
                        <span
                          aria-hidden="true"
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold ${
                            iso === todayIso ? 'bg-purple-800 text-white' : inMonth ? 'text-neutral-800' : 'text-neutral-600'
                          }`}
                        >
                          {date.getDate()}
                        </span>
                        {items.slice(0, limit).map((order) => (
                          <span
                            key={order.id}
                            className={`truncate rounded px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${CHIP[chipTone(order)]}`}
                          >
                            #{order.id} {order.destinatario}
                          </span>
                        ))}
                        {items.length > limit && (
                          <span className="text-xs font-medium text-neutral-700">+{items.length - limit} mais</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <ul className="flex flex-wrap gap-4 border-t border-neutral-200 px-4 py-3 text-sm text-neutral-700 sm:px-5" aria-label="Legenda">
            {[['pendente', 'Pendente'], ['preparacao', 'Em preparação'], ['entregue', 'Entregue'], ['atraso', 'Em atraso']].map(([key, label]) => (
              <li key={key} className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-sm ring-1 ring-inset ${CHIP[key]}`} aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </section>

        <aside className="card h-fit" aria-label="Entregas do dia">
          <div className="card-header">
            <h2 className="text-base font-semibold text-neutral-900">{upperFirst(longDay.format(fromIso(selected)))}</h2>
          </div>
          {dayOrders.length === 0 ? (
            <p className="p-5 text-sm text-neutral-600">Sem entregas neste dia.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {dayOrders.map((order) => {
                const status = statusOf(order);
                const next = nextStatus(order);
                return (
                  <li key={order.id} className="space-y-2 px-5 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-900">
                          #{order.id} · {order.destinatario}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {order.quantidade} × {productNames.get(String(order.id_produto)) ?? `Produto #${order.id_produto}`} · {formatCurrency(order.valor)}
                        </p>
                        <p className="text-sm text-neutral-600">{order.endereco_destinatario}</p>
                      </div>
                      <OrderStatusBadge order={order} />
                    </div>
                    <div className="flex items-center">
                      <Link to={`/encomendas/${order.id}/recibo`} className="link-action">
                        Recibo
                      </Link>
                      {next && can('encomendas.estado') && (
                        <>
                          <span className="mx-3 h-4 w-px bg-neutral-300" aria-hidden="true" />
                          <button type="button" className="link-action" onClick={() => advance(order)} disabled={busyId === order.id}>
                            {busyId === order.id ? 'A guardar...' : `Marcar “${next.label}”`}
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
