import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineMail, HiOutlinePrinter, HiOutlineLink } from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import ErrorBanner from '../../components/ui/ErrorBanner';
import OrderStatusBadge from '../../components/ui/OrderStatusBadge';
import ProductThumb from '../../components/ui/ProductThumb';
import { Skeleton } from '../../components/ui/Skeleton';
import { getErrorMessage, getOrder, getProduct, updateOrderStatus } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { formatCurrency, formatDate } from '../../lib/format';
import { ORDER_STATUS, nextStatus, statusOf } from '../../lib/orderStatus';
import { useSettings } from '../../lib/settings';

const VAT_RATE = 0.16;

const DOCUMENTS = [
  { key: 'recibo', label: 'Recibo', prefix: 'REC' },
  { key: 'guia', label: 'Guia de entrega', prefix: 'GUIA' },
];
const FORMATS = [
  { key: 'a4', label: 'A4' },
  { key: 'talao', label: 'Talão 80 mm' },
];
const STAMPS = {
  entregue: { label: 'Entregue', cls: 'border-emerald-600 text-emerald-700' },
  cancelada: { label: 'Cancelada', cls: 'border-rose-600 text-rose-700' },
};

/** Barras decorativas derivadas do número do documento. */
function Barcode({ text }) {
  const bars = [...text].flatMap((char, index) => {
    const width = 1 + (char.charCodeAt(0) % 3);
    return [{ x: index, w: width }];
  });
  let cursor = 0;
  return (
    <svg viewBox={`0 0 ${bars.length * 5 + 4} 28`} className="h-8 w-full max-w-[9rem]" aria-hidden="true">
      {bars.map((bar, index) => {
        const x = cursor;
        cursor += bar.w + 2.2;
        return <rect key={index} x={x} y="0" width={bar.w} height="28" fill="#262626" />;
      })}
    </svg>
  );
}

function Segmented({ label, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            aria-pressed={value === option.key}
            onClick={() => onChange(option.key)}
            className={`btn ${value === option.key ? 'btn-primary' : 'btn-secondary'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function Recibo() {
  const { id } = useParams();
  const { can } = useAuth();
  const { settings } = useSettings();

  const [order, setOrder] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const [doc, setDoc] = useState('recibo');
  const [format, setFormat] = useState('a4');
  const [show, setShow] = useState({ foto: true, iva: true, assinatura: true });

  useEffect(() => {
    let active = true;
    setLoading(true);
    getOrder(id)
      .then(async (data) => {
        const item = await getProduct(data.id_produto).catch(() => null);
        if (!active) return;
        setOrder(data);
        setProduct(item);
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError, 'Encomenda não encontrada.'));
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const changeStatus = async (estado) => {
    setBusy(true);
    setError('');
    try {
      setOrder(await updateOrderStatus(order.id, estado));
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Não foi possível atualizar o estado.'));
    } finally {
      setBusy(false);
    }
  };

  const numbers = useMemo(() => {
    if (!order) return null;
    const total = Number(order.valor) || 0;
    const base = total / (1 + VAT_RATE);
    const prefix = DOCUMENTS.find((item) => item.key === doc).prefix;
    const year = String(order.data_criacao ?? '').slice(0, 4) || new Date().getFullYear();
    return {
      total,
      base,
      vat: total - base,
      unit: total / (Number(order.quantidade) || 1),
      code: `${prefix}-${year}-${String(order.id).padStart(4, '0')}`,
    };
  }, [order, doc]);

  const status = order ? statusOf(order) : null;
  const next = order ? nextStatus(order) : null;
  const stamp = order ? STAMPS[order.estado] : null;
  const narrow = format === 'talao';
  const docLabel = DOCUMENTS.find((item) => item.key === doc).label;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Não foi possível copiar a ligação.');
    }
  };

  const mailto = order
    ? `mailto:?subject=${encodeURIComponent(`${docLabel} ${numbers.code} — ${settings.empresa}`)}&body=${encodeURIComponent(
        `Olá ${order.solicitante},\n\nSegue o ${docLabel.toLowerCase()} ${numbers.code}: ${product?.nome ?? ''} × ${order.quantidade}, total ${formatCurrency(numbers.total)}.\nEntrega prevista: ${formatDate(order.data_entrega)}.\n\nObrigado,\n${settings.empresa}`
      )}`
    : '#';

  return (
    <div>
      <PageHeader
        breadcrumb="Encomendas"
        title={order ? `${docLabel} ${numbers.code}` : 'Recibo'}
        description="Escolha o documento e o formato; imprima ou guarde em PDF pelo diálogo de impressão."
        actions={
          <>
            <Link to="/encomendas/list" className="btn btn-secondary">
              <HiOutlineArrowLeft aria-hidden="true" /> Voltar à lista
            </Link>
            <a href={mailto} className="btn btn-secondary" aria-disabled={!order}>
              <HiOutlineMail aria-hidden="true" /> Email
            </a>
            <button type="button" className="btn btn-primary" onClick={() => window.print()} disabled={!order}>
              <HiOutlinePrinter aria-hidden="true" /> Imprimir / PDF
            </button>
          </>
        }
      />

      <ErrorBanner message={error} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_20rem]">
        {/* Papel */}
        <div className="min-w-0">
          {loading || !order ? (
            <div className="mx-auto max-w-3xl space-y-4 rounded-md bg-white p-8 shadow-lg" aria-busy="true">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <article
              className={`paper light-scope relative mx-auto overflow-hidden rounded-md bg-surface text-neutral-900 shadow-xl ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-2xl ${
                narrow ? 'max-w-[22rem] text-sm' : 'max-w-3xl'
              }`}
              aria-label={`${docLabel} ${numbers.code}`}
            >
              <div className="h-2 bg-linear-to-r from-purple-950 via-purple-800 to-purple-600" aria-hidden="true" />

              {stamp && (
                <span
                  key={order.estado}
                  className={`stamp-in pointer-events-none absolute right-6 top-24 z-10 -rotate-12 rounded-md border-4 px-3 py-1 text-xl font-extrabold uppercase tracking-widest opacity-80 ${stamp.cls}`}
                >
                  {stamp.label}
                </span>
              )}

              <div className={narrow ? 'space-y-4 p-5' : 'space-y-6 p-8'}>
                <header className={`flex ${narrow ? 'flex-col gap-2 text-center' : 'items-start justify-between gap-4'}`}>
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">{settings.empresa}</p>
                    <p className="text-neutral-600">{settings.email}</p>
                  </div>
                  <div className={narrow ? '' : 'text-right'}>
                    <p className="text-sm font-semibold uppercase tracking-widest text-[#6b21a8]">{docLabel}</p>
                    <p className="text-xl font-bold">{numbers.code}</p>
                    <p className="text-neutral-600">Emitido em {formatDate(order.data_criacao)}</p>
                  </div>
                </header>

                <section className={`grid gap-4 ${narrow ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">Cliente</h2>
                    <p className="font-semibold">{order.solicitante}</p>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">Entregar a</h2>
                    <p className="font-semibold">{order.destinatario}</p>
                    <p className="text-neutral-700">{order.endereco_destinatario}</p>
                    <p className="text-neutral-700">Entrega: {formatDate(order.data_entrega)}</p>
                  </div>
                </section>

                <section>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-2 border-neutral-900 text-sm uppercase tracking-wide text-neutral-700">
                        <th className="py-2 pr-2 font-semibold">Produto</th>
                        <th className="py-2 pr-2 text-right font-semibold">Qtd.</th>
                        {doc === 'recibo' && !narrow && <th className="py-2 pr-2 text-right font-semibold">Preço</th>}
                        {doc === 'recibo' && <th className="py-2 text-right font-semibold">Total</th>}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-200">
                        <td className="py-3 pr-2">
                          <div className="flex items-center gap-3">
                            {show.foto && <ProductThumb src={product?.imagem} name={product?.nome ?? ''} className="h-12 w-12" />}
                            <div>
                              <p className="font-medium">{product?.nome ?? `Produto #${order.id_produto}`}</p>
                              {product?.categoria && <p className="text-sm text-neutral-600">{product.categoria}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-2 text-right">{order.quantidade}</td>
                        {doc === 'recibo' && !narrow && <td className="py-3 pr-2 text-right">{formatCurrency(numbers.unit)}</td>}
                        {doc === 'recibo' && <td className="py-3 text-right font-medium">{formatCurrency(numbers.total)}</td>}
                      </tr>
                    </tbody>
                  </table>
                </section>

                {doc === 'recibo' ? (
                  <section className="ml-auto w-full max-w-xs space-y-1">
                    {show.iva && (
                      <>
                        <div className="flex justify-between text-neutral-700">
                          <span>Subtotal (sem IVA)</span>
                          <span>{formatCurrency(numbers.base)}</span>
                        </div>
                        <div className="flex justify-between text-neutral-700">
                          <span>IVA incluído (16%)</span>
                          <span>{formatCurrency(numbers.vat)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between border-t-2 border-neutral-900 pt-2 text-xl font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(numbers.total)}</span>
                    </div>
                  </section>
                ) : (
                  <section className="rounded-md border border-neutral-300 p-4">
                    <p className="text-sm font-semibold uppercase tracking-wide text-neutral-600">A entregar</p>
                    <p className="text-lg font-bold">
                      {order.quantidade} × {product?.nome ?? `Produto #${order.id_produto}`}
                    </p>
                    <p className="text-neutral-700">Confirme o conteúdo na presença do destinatário.</p>
                  </section>
                )}

                {show.assinatura && (
                  <section className={`grid gap-6 pt-6 ${narrow ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {['Entregue por', 'Recebido por'].map((label) => (
                      <div key={label}>
                        <div className="h-px bg-neutral-900" />
                        <p className="mt-1 text-sm text-neutral-600">{label}</p>
                      </div>
                    ))}
                  </section>
                )}

                <footer className="flex items-end justify-between gap-4 border-t border-neutral-200 pt-4 text-sm text-neutral-600">
                  <p>
                    Obrigado pela preferência.
                    <br />
                    {settings.empresa} · {settings.email}
                  </p>
                  <Barcode text={numbers.code} />
                </footer>
              </div>
            </article>
          )}
        </div>

        {/* Opções */}
        <aside aria-label="Opções do documento" className="no-print flex flex-col gap-5 xl:sticky xl:top-0 xl:self-start">
          <section className="card space-y-4 p-4">
            <h2 className="text-base font-semibold text-neutral-900">Documento</h2>
            <Segmented label="Tipo" options={DOCUMENTS} value={doc} onChange={setDoc} />
            <Segmented label="Formato" options={FORMATS} value={format} onChange={setFormat} />
            <fieldset>
              <legend className="label">Mostrar</legend>
              <div className="space-y-2">
                {[
                  ['foto', 'Foto do produto'],
                  ['iva', 'Detalhe do IVA (só no recibo)'],
                  ['assinatura', 'Linhas de assinatura'],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-neutral-800">
                    <input
                      type="checkbox"
                      checked={show[key]}
                      onChange={(event) => setShow((current) => ({ ...current, [key]: event.target.checked }))}
                      className="h-4 w-4 rounded border-control accent-purple-700"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            <button type="button" className="link-action" onClick={copyLink}>
              <HiOutlineLink className="mr-1" aria-hidden="true" />
              {copied ? 'Ligação copiada!' : 'Copiar ligação'}
            </button>
          </section>

          <section className="card space-y-4 p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-neutral-900">Estado</h2>
              {order && <OrderStatusBadge order={order} />}
            </div>

            <ol className="space-y-2" aria-label="Fluxo da encomenda">
              {ORDER_STATUS.slice(0, 3).map((step, index) => {
                const currentIndex = ORDER_STATUS.findIndex((item) => item.key === order?.estado);
                const done = order && order.estado !== 'cancelada' && index <= currentIndex;
                return (
                  <li key={step.key} className="flex items-center gap-3 text-sm">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        done ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-700'
                      }`}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <span className={done ? 'font-medium text-neutral-900' : 'text-neutral-600'}>
                      {step.label}
                      <span className="sr-only">{done ? ' (concluído)' : ' (por fazer)'}</span>
                    </span>
                  </li>
                );
              })}
            </ol>

            {order && can('encomendas.estado') && (
              <div className="space-y-2 border-t border-neutral-200 pt-4">
                {next && (
                  <button type="button" className="btn btn-primary w-full" onClick={() => changeStatus(next.key)} disabled={busy}>
                    Avançar para “{next.label}”
                  </button>
                )}
                {order.estado === 'cancelada' && (
                  <button type="button" className="btn btn-secondary w-full" onClick={() => changeStatus('pendente')} disabled={busy}>
                    Reativar como pendente
                  </button>
                )}
                {(order.estado === 'pendente' || order.estado === 'preparacao') && (
                  <button type="button" className="link-action link-action-danger" onClick={() => changeStatus('cancelada')} disabled={busy}>
                    Cancelar encomenda
                  </button>
                )}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
