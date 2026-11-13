import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineExclamationCircle,
  HiOutlineUpload,
  HiOutlineXCircle,
} from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorBanner from '../../components/ui/ErrorBanner';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination, { usePagination } from '../../components/ui/Pagination';
import { getErrorMessage } from '../../lib/api';
import { formatNumber } from '../../lib/format';
import {
  downloadCsvTemplate,
  parseImportFile,
  readImportHistory,
  writeImportHistory,
} from '../../lib/importFile';

const MIN_LOADING = 1000; // ms: tempo mínimo do "loading", para o passo ser visível.
const CHUNK = 10; // linhas enviadas de cada vez (dá progresso real).

const dateTime = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short', timeStyle: 'short' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formatSize = (bytes) =>
  bytes < 1024 ? `${bytes} B` : `${formatNumber(Math.round(bytes / 1024))} KB`;

const countRows = (doc) => {
  const ok = doc.rows.filter((row) => row.ok).length;
  return { ok, failed: doc.rows.length - ok };
};

function readFileText(file, onProgress) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Não foi possível ler o ficheiro.'));
    reader.readAsText(file);
  });
}

function ProgressBar({ value, label }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm text-neutral-700">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-200"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
      >
        <div
          className="h-full rounded-full bg-purple-700 transition-[width] duration-150"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

const VIEWS = {
  preview: {
    filters: [
      ['all', 'Todas'],
      ['ok', 'Válidas'],
      ['failed', 'Com erros'],
    ],
    ok: 'Válida',
    failed: 'Com erro',
    okDetail: () => 'Pronta para enviar',
  },
  result: {
    filters: [
      ['all', 'Todos'],
      ['ok', 'Importados'],
      ['failed', 'Falharam'],
    ],
    ok: 'Importado',
    failed: 'Falhou',
    okDetail: (row) => `Criado com o nº ${row.id}`,
  },
};

/** Tabela de linhas com filtro por resultado e paginação (10 por página). */
function RowsTable({ rows, mode }) {
  const view = VIEWS[mode];
  const [filter, setFilter] = useState('all');
  const counts = {
    all: rows.length,
    ok: rows.filter((row) => row.ok).length,
    failed: rows.filter((row) => !row.ok).length,
  };
  const visible = rows.filter((row) => filter === 'all' || (filter === 'ok' ? row.ok : !row.ok));
  const pagination = usePagination(visible);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Filtrar linhas">
        {view.filters.map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
            className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${
              filter === key
                ? 'bg-purple-800 text-white ring-purple-800'
                : 'bg-surface text-neutral-700 ring-neutral-400 hover:bg-neutral-100'
            }`}
          >
            {label} ({counts[key]})
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead className="bg-neutral-50">
              <tr>
                <th className="th">Linha</th>
                <th className="th">Registo</th>
                <th className="th">Estado</th>
                <th className="th">Detalhe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {pagination.pageItems.map((row) => (
                <tr key={row.line}>
                  <td className="td">{row.line}</td>
                  <td className="td max-w-[18rem] truncate font-medium text-neutral-800">{row.label}</td>
                  <td className="td">
                    <StatusBadge
                      status={row.ok ? view.ok : view.failed}
                      tone={row.ok ? 'success' : 'danger'}
                    />
                  </td>
                  <td className={`td whitespace-normal ${row.ok ? '' : 'text-rose-700'}`}>
                    {row.ok ? view.okDetail(row) : row.reason}
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={4} className="td text-center">
                    Nenhuma linha neste filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination {...pagination} />
      </div>
    </div>
  );
}

/**
 * Página de importação em 3 passos: escolher o ficheiro (com loading),
 * pré-visualizar e validar a lista, e só depois enviar.
 *
 * `config` (ver `configs.js`):
 * - entity: chave do histórico (ex.: 'produtos')
 * - breadcrumb, title, description, listPath: textos e caminho de regresso
 * - columns, sample: colunas esperadas e linhas de exemplo do modelo CSV
 * - loadContext(): dados auxiliares para a validação (opcional)
 * - validate(row, context): motivo da falha, ou null se a linha for válida
 * - describe(row): texto que identifica a linha
 * - importMany(rows): guarda as linhas válidas e devolve os registos criados
 */
export default function ImportPage({ config }) {
  const inputRef = useRef(null);
  const [documents, setDocuments] = useState(() => readImportHistory(config.entity));
  const [expanded, setExpanded] = useState(null);
  const [dragging, setDragging] = useState(false);
  // stage: null | {phase: 'reading' | 'ready' | 'sending', name, size, progress, step, rows}
  const [stage, setStage] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const history = usePagination(documents);
  const busy = stage?.phase === 'reading' || stage?.phase === 'sending';

  useEffect(() => {
    writeImportHistory(config.entity, documents);
  }, [config.entity, documents]);

  const addDocument = (doc) => {
    setDocuments((current) => [doc, ...current]);
    history.setPage(1);
  };

  /** Passo 1: ler o ficheiro e validar as linhas, sem gravar nada. */
  const loadFile = async (file) => {
    setError('');
    setStage({ phase: 'reading', name: file.name, size: file.size, progress: 0, step: 'A ler o ficheiro...' });

    const started = Date.now();
    const ticker = setInterval(
      () =>
        setStage((current) =>
          current?.phase === 'reading'
            ? { ...current, progress: Math.min(current.progress + 5, 90) }
            : current
        ),
      80
    );

    try {
      const text = await readFileText(file, () => {});
      const parsed = parseImportFile(file.name, text);
      setStage((current) => ({ ...current, step: 'A validar as linhas...' }));
      const context = (await config.loadContext?.()) ?? null;

      const rows = parsed.map((row, index) => {
        const reason = config.validate(row, context);
        return {
          row,
          // +2: a linha 1 do ficheiro é o cabeçalho.
          line: index + 2,
          label: config.describe(row) || '(sem identificação)',
          ok: !reason,
          reason: reason ?? '',
        };
      });

      await sleep(Math.max(0, MIN_LOADING - (Date.now() - started)));
      setStage((current) => ({ ...current, progress: 100, step: 'Ficheiro lido.' }));
      await sleep(250);
      setStage({ phase: 'ready', name: file.name, size: file.size, rows });
    } catch (loadError) {
      setStage(null);
      const message = loadError?.message || 'Não foi possível ler o ficheiro.';
      setError(`${file.name}: ${message}`);
      addDocument({
        id: `${Date.now()}`,
        name: file.name,
        size: file.size,
        date: new Date().toISOString(),
        error: message,
        rows: [],
      });
    } finally {
      clearInterval(ticker);
    }
  };

  /** Passo 3: enviar as linhas válidas, em blocos, com progresso. */
  const sendFile = async () => {
    if (stage?.phase !== 'ready') return;
    const { name, size, rows } = stage;
    const valid = rows.filter((row) => row.ok);
    const outcome = new Map();

    setStage({ phase: 'sending', name, size, progress: 0, step: `A enviar ${valid.length} registo(s)...` });

    for (let start = 0; start < valid.length; start += CHUNK) {
      const chunk = valid.slice(start, start + CHUNK);
      try {
        const created = await config.importMany(chunk.map((item) => item.row));
        chunk.forEach((item, index) => outcome.set(item.line, { id: created[index]?.id }));
      } catch (sendError) {
        const reason = `Falha no envio: ${getErrorMessage(sendError, 'erro desconhecido.')}`;
        chunk.forEach((item) => outcome.set(item.line, { reason }));
      }
      const done = Math.min(start + CHUNK, valid.length);
      setStage((current) => ({ ...current, progress: (done / valid.length) * 100 }));
    }
    await sleep(250);

    const doc = {
      id: `${Date.now()}`,
      name,
      size,
      date: new Date().toISOString(),
      error: '',
      rows: rows.map((row) => {
        const result = outcome.get(row.line);
        const failedValidation = !row.ok;
        const failedSend = Boolean(result?.reason);
        return {
          line: row.line,
          label: row.label,
          ok: !failedValidation && !failedSend,
          reason: failedValidation ? row.reason : (result?.reason ?? ''),
          id: result?.id ?? null,
        };
      }),
    };
    addDocument(doc);
    setExpanded(doc.id);
    setStage(null);
  };

  const handleFiles = (fileList) => {
    const files = [...(fileList ?? [])];
    if (files.length === 0 || busy) return;
    setNotice(
      files.length > 1
        ? `Só se pré-visualiza um ficheiro de cada vez. Foi usado "${files[0].name}"; volte a carregar os restantes depois.`
        : ''
    );
    loadFile(files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const totals = documents.reduce(
    (sum, doc) => {
      const counts = countRows(doc);
      return { ok: sum.ok + counts.ok, failed: sum.failed + counts.failed };
    },
    { ok: 0, failed: 0 }
  );

  const previewCounts = stage?.phase === 'ready' ? countRows(stage) : { ok: 0, failed: 0 };

  return (
    <div>
      <PageHeader
        breadcrumb={config.breadcrumb}
        title={config.title}
        description={config.description}
        actions={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                downloadCsvTemplate(`modelo-${config.entity}.csv`, config.columns, config.sample)
              }
            >
              <HiOutlineDownload /> Modelo CSV
            </button>
            <Link to={config.listPath} className="btn btn-secondary">
              <HiOutlineArrowLeft /> Voltar à lista
            </Link>
          </>
        }
      />

      <ErrorBanner message={error} />
      {notice && (
        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
          {notice}
        </p>
      )}

      {/* Passo 1: escolher o ficheiro */}
      {!stage && (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center ${
            dragging ? 'border-purple-700 bg-purple-50' : 'border-neutral-400 bg-surface'
          }`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-3xl text-purple-800">
            <HiOutlineUpload />
          </span>
          <div>
            <p className="text-lg font-semibold text-neutral-900">
              {dragging ? 'Largue o ficheiro aqui' : 'Arraste o ficheiro para aqui'}
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Ficheiro .csv ou .json. Vai poder ver a lista antes de enviar.
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => inputRef.current?.click()}>
            Escolher ficheiro
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.json,text/csv,application/json"
            className="hidden"
            onChange={(event) => {
              handleFiles(event.target.files);
              event.target.value = '';
            }}
          />
          <p className="text-sm text-neutral-600">Colunas: {config.columns.join(', ')}</p>
        </div>
      )}

      {/* A ler / a enviar */}
      {busy && (
        <div className="card p-6" aria-live="polite">
          <div className="mb-4 flex items-center gap-3">
            <HiOutlineDocumentText className="shrink-0 text-3xl text-purple-800" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-neutral-900">{stage.name}</p>
              <p className="text-sm text-neutral-600">{formatSize(stage.size)}</p>
            </div>
          </div>
          <ProgressBar value={stage.progress} label={stage.step} />
        </div>
      )}

      {/* Passo 2: pré-visualização */}
      {stage?.phase === 'ready' && (
        <div className="card">
          <div className="card-header">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-neutral-900">Pré-visualização</h2>
              <p className="truncate text-sm text-neutral-600">
                {stage.name} · {formatSize(stage.size)} · {stage.rows.length} linha(s)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={`${previewCounts.ok} válidas`} tone="success" />
              <StatusBadge
                status={`${previewCounts.failed} com erros`}
                tone={previewCounts.failed ? 'danger' : 'neutral'}
              />
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <RowsTable rows={stage.rows} mode="preview" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 px-4 py-4 sm:px-5">
            <p className="text-sm text-neutral-700">
              {previewCounts.ok === 0
                ? 'Não há linhas válidas para enviar.'
                : previewCounts.failed > 0
                  ? `Só as ${previewCounts.ok} linhas válidas serão enviadas; as ${previewCounts.failed} com erros ficam de fora.`
                  : 'Todas as linhas estão válidas.'}
            </p>
            <div className="flex gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setStage(null)}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={sendFile}
                disabled={previewCounts.ok === 0}
              >
                Enviar {previewCounts.ok} registo(s)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Histórico */}
      <div className="card mt-5">
        <div className="card-header">
          <h2 className="text-base font-semibold text-neutral-900">Documentos importados</h2>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={`${totals.ok} importados`} tone="success" />
            <StatusBadge
              status={`${totals.failed} falharam`}
              tone={totals.failed ? 'danger' : 'neutral'}
            />
            {documents.length > 0 && (
              <button type="button" className="link-action" onClick={() => setDocuments([])}>
                Limpar histórico
              </button>
            )}
          </div>
        </div>

        <ul className="divide-y divide-neutral-200">
          {history.pageItems.map((doc) => {
            const counts = countRows(doc);
            const open = expanded === doc.id;
            const rejected = Boolean(doc.error);
            const nothingImported = rejected || counts.ok === 0;
            const StatusIcon = nothingImported
              ? HiOutlineXCircle
              : counts.failed > 0
                ? HiOutlineExclamationCircle
                : HiOutlineCheckCircle;
            const iconTone = nothingImported
              ? 'text-rose-600'
              : counts.failed > 0
                ? 'text-amber-600'
                : 'text-emerald-600';

            return (
              <li key={doc.id}>
                <div className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-50 sm:px-5">
                  <button
                    type="button"
                    onClick={() => setExpanded(open ? null : doc.id)}
                    aria-expanded={open}
                    disabled={rejected}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <span className="w-4 shrink-0 text-neutral-600" aria-hidden="true">
                      {!rejected && (open ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />)}
                    </span>
                    <StatusIcon className={`shrink-0 text-2xl ${iconTone}`} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-neutral-900">{doc.name}</span>
                      <span className="block text-sm text-neutral-600">
                        {dateTime.format(new Date(doc.date))} · {formatSize(doc.size)}
                        {rejected ? '' : ` · ${doc.rows.length} linha(s)`}
                      </span>
                      {rejected && <span className="mt-0.5 block text-sm text-rose-700">{doc.error}</span>}
                    </span>
                  </button>

                  <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                    {rejected ? (
                      <StatusBadge status="Ficheiro rejeitado" tone="danger" />
                    ) : (
                      <>
                        <StatusBadge status={`${counts.ok} importados`} tone="success" />
                        {counts.failed > 0 && (
                          <StatusBadge status={`${counts.failed} falharam`} tone="danger" />
                        )}
                      </>
                    )}
                    <span className="mx-1 h-4 w-px bg-neutral-300" aria-hidden="true" />
                    <button
                      type="button"
                      onClick={() => setDocuments((current) => current.filter((item) => item.id !== doc.id))}
                      className="link-action link-action-danger"
                      aria-label={`Remover ${doc.name} do histórico`}
                    >
                      Remover
                    </button>
                  </div>
                </div>

                {open && !rejected && (
                  <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-4 sm:px-5">
                    <RowsTable rows={doc.rows} mode="result" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {documents.length === 0 && (
          <EmptyState
            icon={HiOutlineDocumentText}
            title="Ainda sem documentos"
            message="Os ficheiros enviados aparecem aqui, com o resultado de cada linha."
          />
        )}

        <Pagination {...history} />
      </div>
    </div>
  );
}
