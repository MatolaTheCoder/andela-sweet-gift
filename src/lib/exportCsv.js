/**
 * Descarrega uma lista como CSV (abre diretamente no Excel: separador ";" e BOM UTF-8).
 *
 * @param {string} filename
 * @param {{header: string, value: (row: object) => string | number}[]} columns
 * @param {object[]} rows
 */
export function exportCsv(filename, columns, rows) {
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const lines = [
    columns.map((column) => escape(column.header)).join(';'),
    ...rows.map((row) => columns.map((column) => escape(column.value(row))).join(';')),
  ];
  const blob = new Blob([`﻿${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
