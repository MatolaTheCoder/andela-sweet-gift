import { permissionsForRole } from './permissions';
import { brandEmail } from './brand';

/**
 * Dados simulados para apresentação. Não existe backend: tudo é guardado
 * no localStorage do navegador (ver `src/lib/api.js`).
 */

/** Credenciais de demonstração — mostradas no ecrã de login. */
export const DEMO_CREDENTIALS = {
  email: brandEmail('demo'),
  password: 'demo1234',
};

export const DEMO_USER = {
  id: 1,
  name: 'Andela Demo',
  email: DEMO_CREDENTIALS.email,
  telefone: '+258 84 000 0000',
  cargo: 'Gestora da loja',
  role: 'administrador',
  permissions: ['*'],
};

export const PRODUCT_CATEGORIES = ['Presentes', 'Flores', 'Decoração', 'Casa', 'Doces'];

/** Vendas mensais (MZN) do ano anterior, usadas como comparação no gráfico. */
export const MOCK_PREVIOUS_YEAR_SALES = [
  8200, 6400, 9100, 7800, 6900, 9800, 12400, 10200, 11800, 9300, 10900, 14100,
];

const pad = (value) => String(value).padStart(2, '0');
/** Data local em AAAA-MM-DD (toISOString desloca o dia por causa do fuso). */
const iso = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const daysFromToday = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return iso(date);
};

export const MOCK_PRODUCTS = [
  { id: 1, nome: 'Chávena personalizada', descricao: 'Chávena de cerâmica com foto ou frase', preco: 560, categoria: 'Casa', stock: 14, stock_minimo: 5, data_criacao: daysFromToday(-320) },
  { id: 2, nome: 'Quadro decorativo', descricao: 'Quadro A4 com moldura de madeira', preco: 799, categoria: 'Decoração', stock: 6, stock_minimo: 4, data_criacao: daysFromToday(-300) },
  { id: 3, nome: 'Buquê de rosas', descricao: 'Buquê com 12 rosas vermelhas', preco: 1299, categoria: 'Flores', stock: 3, stock_minimo: 5, data_criacao: daysFromToday(-280) },
  { id: 4, nome: 'Balão personalizado', descricao: 'Balão bubble com nome e confetes', preco: 899, categoria: 'Decoração', stock: 22, stock_minimo: 6, data_criacao: daysFromToday(-260) },
  { id: 5, nome: 'Toalha personalizada', descricao: 'Toalha de banho com nome bordado', preco: 499, categoria: 'Casa', stock: 9, stock_minimo: 4, data_criacao: daysFromToday(-240) },
  { id: 6, nome: 'Cesta de chocolates', descricao: 'Cesta com chocolates sortidos e cartão', preco: 1850, categoria: 'Doces', stock: 4, stock_minimo: 5, data_criacao: daysFromToday(-120) },
  { id: 7, nome: 'Caixa surpresa', descricao: 'Caixa com flores, doces e peluche', preco: 2400, categoria: 'Presentes', stock: 0, stock_minimo: 3, data_criacao: daysFromToday(-60) },
  { id: 8, nome: 'Almofada com foto', descricao: 'Almofada 40x40 cm com impressão', preco: 750, categoria: 'Casa', stock: 30, stock_minimo: 8, data_criacao: daysFromToday(-20) },
];

/** Gerador pseudo-aleatório com semente fixa: os dados são sempre os mesmos. */
function createRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/* Clientes fictícios: [nome, género, idade]. */
const FEMALE_NAMES = ['Marta', 'Telma', 'Sónia', 'Neusa', 'Joana', 'Lúcia', 'Celeste', 'Yara', 'Anabela', 'Dulce', 'Isabel', 'Fátima', 'Graça', 'Helena'];
const MALE_NAMES = ['Carlos', 'Hélder', 'Ivan', 'Edson', 'Rui', 'Paulo', 'Nelson', 'Dércio', 'Armando', 'Flávio', 'Gil', 'Jaime'];
const SURNAMES = ['Macuácua', 'Sitoe', 'Nhantumbo', 'Cossa', 'Chissano', 'Mondlane', 'Tembe', 'Bila', 'Langa', 'Machava', 'Zandamela', 'Mabunda', 'Muianga', 'Guambe'];

function buildClients() {
  const random = createRandom(7);
  const clients = new Map();
  for (let index = 0; clients.size < 48; index += 1) {
    const female = random() < 0.6;
    const names = female ? FEMALE_NAMES : MALE_NAMES;
    const nome = `${names[Math.floor(random() * names.length)]} ${SURNAMES[Math.floor(random() * SURNAMES.length)]}`;
    const idade = 19 + Math.floor(((random() + random()) / 2) * 40);
    if (!clients.has(nome)) clients.set(nome, [nome, female ? 'F' : 'M', idade]);
  }
  return [...clients.values()];
}

const CLIENTS = buildClients();

const RECIPIENTS = [
  'Ana Macuácua', 'João Sitoe', 'Lúcia Nhantumbo', 'Neusa Cossa', 'Rosa Chissano',
  'Equipa Masterlink', 'Kelvin Macuácua', 'Dércio Cossa', 'Carla Langa', 'Mário Bila',
];

const ADDRESSES = [
  'Av. 24 de Julho, Maputo', 'Bairro da Polana, Maputo', 'Sommerschield, Maputo',
  'Bairro do Fomento, Matola', 'Machava, Matola', 'Av. Julius Nyerere, Maputo',
  'Triunfo, Maputo', 'Bairro Central, Maputo',
];

function buildOrders() {
  const random = createRandom(2026);
  const pick = (list) => list[Math.floor(random() * list.length)];
  const now = new Date();
  const orders = [];

  for (let month = 0; month <= now.getMonth(); month += 1) {
    const lastDay = month === now.getMonth() ? now.getDate() : 28;
    const count = month === now.getMonth() ? Math.max(3, Math.round(lastDay / 2)) : 5 + Math.floor(random() * 5);
    const days = Array.from({ length: count }, () => 1 + Math.floor(random() * lastDay)).sort((a, b) => a - b);

    days.forEach((day) => {
      const [solicitante, genero, idade] = pick(CLIENTS);
      const product = MOCK_PRODUCTS[Math.floor(Math.pow(random(), 1.3) * MOCK_PRODUCTS.length)];
      const quantidade = 1 + Math.floor(random() * 3);
      const created = new Date(now.getFullYear(), month, day);
      const delivery = new Date(created);
      delivery.setDate(delivery.getDate() + 2 + Math.floor(random() * 4));

      orders.push({
        id: orders.length + 1,
        id_produto: product.id,
        quantidade,
        valor: product.preco * quantidade,
        solicitante,
        genero,
        idade,
        destinatario: pick(RECIPIENTS),
        endereco_destinatario: pick(ADDRESSES),
        data_criacao: iso(created),
        data_entrega: iso(delivery),
      });
    });
  }

  // Estado: o que já devia ter sido entregue está entregue (ou, às vezes, cancelado);
  // o resto está pendente ou em preparação.
  const today = iso(now);
  const dice = createRandom(99);
  orders.forEach((order) => {
    if (order.data_entrega < today) {
      order.estado = dice() < 0.06 ? 'cancelada' : 'entregue';
    } else {
      order.estado = dice() < 0.5 ? 'pendente' : 'preparacao';
    }
  });

  // Casos de demonstração para o calendário e os alertas: duas entregas hoje,
  // uma amanhã e uma em atraso.
  [
    [0, 'preparacao'],
    [0, 'pendente'],
    [1, 'pendente'],
    [-1, 'pendente'],
  ].forEach(([offset, estado], index) => {
    const order = orders[orders.length - 1 - index];
    if (!order) return;
    const target = daysFromToday(offset);
    order.data_entrega = target < order.data_criacao ? order.data_criacao : target;
    order.estado = estado;
  });

  return orders;
}

export const MOCK_ORDERS = buildOrders();

/** Equipa da loja. O primeiro é o administrador de demonstração (conta do login). */
export const MOCK_COLLABORATORS = [
  { id: 1, nome: 'Andela Demo', email: DEMO_CREDENTIALS.email, cargo: 'Gestora da loja', role: 'administrador', permissions: permissionsForRole('administrador'), ativo: true },
  { id: 2, nome: 'Helena Matsinhe', email: brandEmail('helena'), cargo: 'Gestora de vendas', role: 'gestor', permissions: permissionsForRole('gestor'), ativo: true },
  { id: 3, nome: 'Armando Zunguze', email: brandEmail('armando'), cargo: 'Atendimento', role: 'operador', permissions: permissionsForRole('operador'), ativo: true },
  { id: 4, nome: 'Fátima Cumbe', email: brandEmail('fatima'), cargo: 'Entregas', role: 'operador', permissions: permissionsForRole('operador'), ativo: false },
];

/** Mensagens de clientes (caixa de entrada simulada). `hoursAgo` dá a data relativa. */
export const MOCK_MESSAGES = [
  { id: 1, from: 'Carlos Guambe', text: 'Bom dia! Ainda dá para alterar a morada de entrega da encomenda de hoje?', hoursAgo: 0.4, unread: true },
  { id: 2, from: 'Marta Sitoe', text: 'Obrigada pela entrega ontem, a caixa surpresa chegou perfeita.', hoursAgo: 5, unread: true },
  { id: 3, from: 'Ivan Cossa', text: 'Vocês fazem buquês com cartão personalizado para sexta-feira?', hoursAgo: 26, unread: false },
  { id: 4, from: 'Telma Chissano', text: 'Preciso de 10 almofadas com foto para um evento. Têm desconto por quantidade?', hoursAgo: 50, unread: false },
];
