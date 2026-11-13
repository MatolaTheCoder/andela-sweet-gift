import React, { useMemo, useState } from 'react';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { HiOutlineCash, HiOutlineClock, HiOutlineSearch, HiOutlineXCircle } from 'react-icons/hi';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import Pagination, { usePagination } from '../../components/ui/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatCurrency, formatDate } from '../../lib/format';

const transactions = [
  { id: 1, cliente: 'João Silva', valor: 100, metodo: 'Cartão', data: '2025-01-01', status: 'Pago' },
  { id: 2, cliente: 'Maria Oliveira', valor: 250, metodo: 'PayPal', data: '2025-01-02', status: 'Pendente' },
  { id: 3, cliente: 'Carlos Santos', valor: 75.5, metodo: 'MB Way', data: '2025-01-03', status: 'Falhado' },
  { id: 4, cliente: 'Ana Machava', valor: 320, metodo: 'MB Way', data: '2025-01-04', status: 'Pago' },
  { id: 5, cliente: 'Rui Tembe', valor: 180, metodo: 'Transferência', data: '2025-01-05', status: 'Pendente' },
  { id: 6, cliente: 'Sara Mondlane', valor: 95, metodo: 'Cartão', data: '2025-01-06', status: 'Pago' },
];

const sumByStatus = (status) =>
  transactions
    .filter((transaction) => transaction.status === status)
    .reduce((total, transaction) => total + transaction.valor, 0);

export default function Pagamentos() {
  const [filter, setFilter] = useState('');

  const filteredTransactions = useMemo(() => {
    const search = filter.trim().toLowerCase();
    if (!search) return transactions;
    return transactions.filter(
      (transaction) =>
        transaction.cliente.toLowerCase().includes(search) ||
        transaction.metodo.toLowerCase().includes(search) ||
        transaction.status.toLowerCase().includes(search)
    );
  }, [filter]);

  const pagination = usePagination(filteredTransactions);

  const summary = [
    {
      key: 'paid',
      label: 'Total recebido',
      value: sumByStatus('Pago'),
      icon: HiOutlineCash,
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      key: 'pending',
      label: 'Total pendente',
      value: sumByStatus('Pendente'),
      icon: HiOutlineClock,
      tone: 'bg-amber-50 text-amber-600',
    },
    {
      key: 'failed',
      label: 'Total falhado',
      value: sumByStatus('Falhado'),
      icon: HiOutlineXCircle,
      tone: 'bg-rose-50 text-rose-600',
    },
  ];

  const exportCsv = () => {
    const header = ['ID', 'Cliente', 'Método', 'Data', 'Valor (MZN)', 'Estado'];
    const rows = filteredTransactions.map((transaction) => [
      transaction.id,
      transaction.cliente,
      transaction.metodo,
      transaction.data,
      transaction.valor.toFixed(2),
      transaction.status,
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(';'))
      .join('\r\n');

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transacoes.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        breadcrumb="Pagamentos"
        title="Transações"
        description="Resumo de pagamentos e transações da loja."
        actions={
          <div className="no-print flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
              <FaFilePdf className="text-rose-600" /> Baixar PDF
            </button>
            <button type="button" className="btn btn-secondary" onClick={exportCsv}>
              <FaFileExcel className="text-emerald-600" /> Baixar Excel
            </button>
          </div>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summary.map(({ key, label, value, icon: Icon, tone }) => (
          <div key={key} className="card flex items-center gap-4 p-4">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl ${tone}`}>
              <Icon />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium uppercase tracking-wide text-neutral-600">
                {label}
              </p>
              <p className="truncate text-xl font-semibold text-neutral-900">
                {formatCurrency(value)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header no-print">
          <div className="relative w-full max-w-sm">
            <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Pesquisar por cliente, método ou estado"
              aria-label="Pesquisar transações"
              className="input h-9 pl-9"
            />
          </div>
          <span className="text-xs font-medium text-neutral-600">
            {filteredTransactions.length} de {transactions.length} transações
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-neutral-50">
              <tr>
                <th className="th">ID</th>
                <th className="th">Cliente</th>
                <th className="th">Método</th>
                <th className="th">Data</th>
                <th className="th">Valor</th>
                <th className="th">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {pagination.pageItems.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-neutral-50">
                  <td className="td font-medium text-neutral-800">#{transaction.id}</td>
                  <td className="td max-w-[14rem] truncate">{transaction.cliente}</td>
                  <td className="td">{transaction.metodo}</td>
                  <td className="td">{formatDate(transaction.data)}</td>
                  <td className="td font-medium text-neutral-800">
                    {formatCurrency(transaction.valor)}
                  </td>
                  <td className="td">
                    <StatusBadge status={transaction.status} />
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      title="Nenhuma transação encontrada"
                      message="Tente ajustar a pesquisa."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination {...pagination} />

        <p className="border-t border-neutral-200 px-4 py-3 text-xs text-neutral-600 sm:px-5">
          Dados de demonstração enquanto a API de pagamentos não está disponível.
        </p>
      </div>
    </div>
  );
}
