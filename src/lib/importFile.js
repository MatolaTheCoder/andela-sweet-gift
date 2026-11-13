/** Leitura de ficheiros de importação (CSV ou JSON) e gestão do histórico. */

/** Lê uma linha CSV respeitando campos entre aspas. */
function splitCsvLine(line, delimiter) {
  const cells = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (quoted) {
      if (char === '"' && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === delimiter) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function parseCsv(text) {
  const lines = text
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim());
  if (lines.length < 2) return [];

  // O Excel em português exporta com ";" — deteta pelo cabeçalho.
  const delimiter = lines[0].split(';').length > lines[0].split(',').length ? ';' : ',';
  const headers = splitCsvLine(lines[0], delimiter).map((header) => header.toLowerCase());

  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line, delimiter);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']));
  });
}

/** Devolve a lista de registos de um ficheiro .csv ou .json. */
export function parseImportFile(name, text) {
  const lower = name.toLowerCase();
  if (lower.endsWith('.json')) {
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('O ficheiro JSON é inválido.');
    }
    if (!Array.isArray(data)) throw new Error('O ficheiro JSON deve conter uma lista de registos.');
    return data;
  }
  if (!lower.endsWith('.csv')) {
    throw new Error('Formato não suportado. Use um ficheiro .csv ou .json.');
  }
  const rows = parseCsv(text);
  if (rows.length === 0) throw new Error('O ficheiro não tem linhas de dados.');
  return rows;
}

export function downloadCsvTemplate(fileName, columns, sample = []) {
  const csv = [columns, ...sample].map((row) => row.join(';')).join('\r\n');
  const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

const historyKey = (entity) => `mock:imports:${entity}`;

export function readImportHistory(entity) {
  try {
    return JSON.parse(localStorage.getItem(historyKey(entity)) ?? '[]') ?? [];
  } catch {
    return [];
  }
}

export function writeImportHistory(entity, documents) {
  localStorage.setItem(historyKey(entity), JSON.stringify(documents));
}
