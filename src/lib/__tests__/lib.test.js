import { parseImportFile } from '../importFile';
import { ageBreakdown, genderBreakdown, pctChange, salesByMonth, summary } from '../stats';
import { ALL_PERMISSIONS, hasPermission, permissionsForRole } from '../permissions';
import { isDueToday, isOverdue, nextStatus, stockLevel } from '../orderStatus';
import { CURRENCIES, formatCurrency, setCurrency } from '../format';

describe('importFile', () => {
  it('lê CSV com ";" e campos entre aspas', () => {
    const rows = parseImportFile('x.csv', 'nome;preco\r\n"Caneca; grande";650\r\nVela;120');
    expect(rows).toEqual([
      { nome: 'Caneca; grande', preco: '650' },
      { nome: 'Vela', preco: '120' },
    ]);
  });

  it('lê CSV com "," e remove o BOM', () => {
    expect(parseImportFile('x.csv', '﻿nome,preco\nVela,120')).toEqual([{ nome: 'Vela', preco: '120' }]);
  });

  it('rejeita JSON inválido, formatos desconhecidos e ficheiros sem linhas', () => {
    expect(() => parseImportFile('x.json', '{')).toThrow('inválido');
    expect(() => parseImportFile('x.json', '{"a":1}')).toThrow('lista');
    expect(() => parseImportFile('x.txt', 'a')).toThrow('Formato');
    expect(() => parseImportFile('x.csv', 'so;cabecalho')).toThrow('linhas');
  });
});

describe('stats', () => {
  const year = new Date().getFullYear();
  const orders = [
    { valor: 100, data_criacao: `${year}-01-10`, genero: 'F', idade: 30, solicitante: 'Ana', estado: 'entregue' },
    { valor: 300, data_criacao: `${year}-01-20`, genero: 'M', idade: 60, solicitante: 'Rui', estado: 'pendente' },
    { valor: 999, data_criacao: `${year}-01-25`, genero: 'F', idade: 30, solicitante: 'Ana', estado: 'cancelada' },
  ];

  it('soma vendas por mês ignorando encomendas canceladas', () => {
    expect(salesByMonth(orders, year)[0]).toBe(400);
  });

  it('conta género e faixa etária sem as canceladas', () => {
    expect(genderBreakdown(orders).map((g) => g.orders)).toEqual([1, 1]);
    expect(ageBreakdown(orders).find((band) => band.key === '55+').orders).toBe(1);
  });

  it('calcula ticket médio e recorrência', () => {
    const result = summary(orders);
    expect(result.orders).toBe(2);
    expect(result.ticket).toBe(200);
    expect(result.recurringRate).toBe(0);
  });

  it('pctChange devolve null sem base de comparação', () => {
    expect(pctChange(10, 0)).toBeNull();
    expect(pctChange(150, 100)).toBe(50);
  });
});

describe('permissões', () => {
  it('o operador não gere colaboradores nem elimina encomendas', () => {
    const operador = permissionsForRole('operador');
    expect(hasPermission(operador, 'encomendas.criar')).toBe(true);
    expect(hasPermission(operador, 'encomendas.eliminar')).toBe(false);
    expect(hasPermission(operador, 'colaboradores.gerir')).toBe(false);
  });

  it('o administrador tem todas as permissões e "*" vale para tudo', () => {
    expect(permissionsForRole('administrador')).toEqual(ALL_PERMISSIONS);
    expect(hasPermission(['*'], 'qualquer.coisa')).toBe(true);
    expect(hasPermission(undefined, 'produtos.ver')).toBe(false);
  });
});

describe('estado das encomendas e stock', () => {
  const today = '2026-11-13';

  it('deteta atrasos e entregas de hoje só em encomendas abertas', () => {
    expect(isOverdue({ estado: 'pendente', data_entrega: '2026-11-12' }, today)).toBe(true);
    expect(isOverdue({ estado: 'entregue', data_entrega: '2026-11-12' }, today)).toBe(false);
    expect(isDueToday({ estado: 'preparacao', data_entrega: today }, today)).toBe(true);
  });

  it('segue o fluxo pendente > preparação > entregue', () => {
    expect(nextStatus({ estado: 'pendente' }).key).toBe('preparacao');
    expect(nextStatus({ estado: 'preparacao' }).key).toBe('entregue');
    expect(nextStatus({ estado: 'entregue' })).toBeNull();
  });

  it('classifica o nível de stock', () => {
    expect(stockLevel({ stock: 0, stock_minimo: 5 }).key).toBe('sem');
    expect(stockLevel({ stock: 5, stock_minimo: 5 }).key).toBe('baixo');
    expect(stockLevel({ stock: 6, stock_minimo: 5 }).key).toBe('ok');
  });
});

describe('moeda', () => {
  it('converte de MZN para a moeda escolhida', () => {
    setCurrency('USD');
    expect(formatCurrency(6400)).toMatch(/100,00/);
    setCurrency('MZN');
    expect(formatCurrency(6400)).toMatch(/6\s?400,00/);
    expect(CURRENCIES.map((c) => c.code)).toEqual(['MZN', 'USD', 'EUR']);
  });
});
