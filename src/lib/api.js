/**
 * API simulada (mock) para apresentação.
 *
 * Mantém as mesmas funções da API real, mas lê e escreve no localStorage
 * em vez de chamar o backend. Para voltar à API real, basta reimplementar
 * estas funções com chamadas HTTP.
 */
import {
  DEMO_CREDENTIALS,
  DEMO_USER,
  MOCK_COLLABORATORS,
  MOCK_MESSAGES,
  MOCK_ORDERS,
  MOCK_PRODUCTS,
} from './mockData';
import { ALL_PERMISSIONS, ROLES, permissionsForRole } from './permissions';
import { ORDER_STATUS, isOpen, isoToday } from './orderStatus';

// O sufixo da versão força a regeneração dos dados quando a estrutura muda.
const KEYS = {
  products: 'mock:products:v3',
  orders: 'mock:orders:v3',
  collaborators: 'mock:collaborators',
  messages: 'mock:messages',
  user: 'mock:user',
  admin: 'mock:admin',
  password: 'mock:password',
};
const DELAY = import.meta.env?.MODE === 'test' ? 0 : 350;

export const USER_UPDATED_EVENT = 'mock:user-updated';
const announceUser = () => window.dispatchEvent(new Event(USER_UPDATED_EVENT));

const respond = (producer) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(producer());
      } catch (error) {
        reject(error);
      }
    }, DELAY);
  });

const fail = (status, message) => {
  const error = new Error(message);
  error.response = { status, data: { message } };
  return error;
};

const read = (key, seed) => {
  try {
    const stored = JSON.parse(localStorage.getItem(key) ?? 'null');
    if (stored) return stored;
  } catch {
    /* dados corrompidos: volta aos dados iniciais */
  }
  localStorage.setItem(key, JSON.stringify(seed));
  return structuredClone(seed);
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota cheia (as fotos ocupam espaço): avisa em vez de perder dados em silêncio.
    throw fail(507, 'Sem espaço no navegador para guardar. Remova algumas fotos de produtos.');
  }
};

const nextId = (items) => items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;

const today = isoToday;

function createCollection(key, seed, label, normalize) {
  const all = () => read(key, seed);
  const find = (id) => {
    const item = all().find((entry) => String(entry.id) === String(id));
    if (!item) throw fail(404, `${label} não encontrado(a).`);
    return item;
  };

  return {
    list: () => respond(all),
    get: (id) => respond(() => find(id)),
    create: (data) =>
      respond(() => {
        const items = all();
        const item = { ...normalize(data), id: nextId(items) };
        write(key, [...items, item]);
        return item;
      }),
    update: (id, data) =>
      respond(() => {
        const item = { ...find(id), ...normalize(data), id: find(id).id };
        write(key, all().map((entry) => (String(entry.id) === String(id) ? item : entry)));
        return item;
      }),
    remove: (id) =>
      respond(() => {
        find(id);
        write(key, all().filter((entry) => String(entry.id) !== String(id)));
        return null;
      }),
    /** Acrescenta vários registos de uma vez (importação). */
    importMany: (rows) =>
      respond(() => {
        const items = all();
        let id = nextId(items);
        const created = rows.map((row) => ({ ...normalize(row), id: id++ }));
        write(key, [...items, ...created]);
        return created;
      }),
  };
}

const positive = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : fallback;
};

const normalizeProduct = (data) => ({
  nome: String(data.nome ?? '').trim(),
  descricao: String(data.descricao ?? '').trim(),
  preco: Number(data.preco) || 0,
  categoria: String(data.categoria ?? '').trim() || 'Sem categoria',
  stock: positive(data.stock, 0),
  stock_minimo: data.stock_minimo === '' || data.stock_minimo == null ? 5 : positive(data.stock_minimo, 5),
  // Foto como data URL (já reduzida no formulário); qualquer outra coisa é ignorada.
  imagem: typeof data.imagem === 'string' && data.imagem.startsWith('data:image/') ? data.imagem : '',
  data_criacao: data.data_criacao || today(),
});

/** Aceita "F", "Feminino", "m"...; devolve "F", "M" ou vazio. */
const normalizeGender = (value) => {
  const letter = String(value ?? '').trim().charAt(0).toUpperCase();
  return letter === 'F' || letter === 'M' ? letter : '';
};

const normalizeOrder = (data) => ({
  id_produto: Number(data.id_produto) || data.id_produto,
  quantidade: Number(data.quantidade) || 1,
  valor: Number(data.valor) || 0,
  solicitante: String(data.solicitante ?? '').trim(),
  genero: normalizeGender(data.genero),
  idade: Number(data.idade) || null,
  destinatario: String(data.destinatario ?? '').trim(),
  endereco_destinatario: String(data.endereco_destinatario ?? '').trim(),
  estado: ORDER_STATUS.some((status) => status.key === data.estado) ? data.estado : 'pendente',
  data_criacao: data.data_criacao || today(),
  data_entrega: data.data_entrega || today(),
});

const products = createCollection(KEYS.products, MOCK_PRODUCTS, 'Produto', normalizeProduct);
const orders = createCollection(KEYS.orders, MOCK_ORDERS, 'Encomenda', normalizeOrder);

export const getErrorMessage = (error, fallback = 'Ocorreu um erro. Tente novamente.') =>
  error?.response?.data?.message ||
  (typeof error?.response?.data?.error === 'string' ? error.response.data.error : null) ||
  Object.values(error?.response?.data?.errors ?? {})?.[0]?.[0] ||
  fallback;

/* Colaboradores */
const readCollaborators = () => read(KEYS.collaborators, MOCK_COLLABORATORS);

const normalizeCollaborator = (data) => {
  const role = ROLES.some((item) => item.key === data.role) ? data.role : 'operador';
  return {
    nome: String(data.nome ?? '').trim(),
    email: String(data.email ?? '').trim().toLowerCase(),
    cargo: String(data.cargo ?? '').trim(),
    role,
    permissions: Array.isArray(data.permissions)
      ? data.permissions.filter((key) => ALL_PERMISSIONS.includes(key))
      : permissionsForRole(role),
    ativo: data.ativo !== false,
  };
};

const validateCollaborator = (item, others) => {
  if (!item.nome) throw fail(422, 'Indique o nome do colaborador.');
  if (!/^\S+@\S+\.\S+$/.test(item.email)) throw fail(422, 'Indique um email válido.');
  if (others.some((other) => other.email.toLowerCase() === item.email)) {
    throw fail(422, 'Já existe um colaborador com este email.');
  }
};

/* Auth */
const currentPassword = () => localStorage.getItem(KEYS.password) ?? DEMO_CREDENTIALS.password;
const readAdmin = () => read(KEYS.admin, DEMO_USER);

const userFromCollaborator = (collaborator) => ({
  id: collaborator.id,
  name: collaborator.nome,
  email: collaborator.email,
  cargo: collaborator.cargo,
  telefone: '',
  role: collaborator.role,
  permissions: collaborator.permissions,
});

/** Utilizador atual, de forma síncrona (usado para decidir o que mostrar de imediato). */
export const peekCurrentUser = () => {
  const user = read(KEYS.user, DEMO_USER);
  if (user.role && user.role !== 'administrador') {
    // As permissões vêm sempre da lista de colaboradores, para refletirem alterações.
    const collaborator = readCollaborators().find((item) => String(item.id) === String(user.id));
    if (collaborator) {
      return {
        ...user,
        name: collaborator.nome,
        cargo: collaborator.cargo,
        role: collaborator.role,
        permissions: collaborator.ativo ? collaborator.permissions : [],
      };
    }
  }
  return user;
};

export const loginRequest = ({ email, password }) =>
  respond(() => {
    const typed = String(email).trim().toLowerCase();
    const passwordOk = password === DEMO_CREDENTIALS.password || password === currentPassword();
    const admin = readAdmin();

    let user = null;
    if (typed === DEMO_CREDENTIALS.email || typed === String(admin.email).toLowerCase()) {
      user = admin;
    } else {
      const collaborator = readCollaborators().find((item) => item.ativo && item.email.toLowerCase() === typed);
      if (collaborator) user = userFromCollaborator(collaborator);
    }

    if (!user || !passwordOk) {
      throw fail(401, 'Credenciais inválidas. Use os dados de demonstração.');
    }
    write(KEYS.user, user);
    announceUser();
    return { token: 'mock-token', user };
  });

export const registerRequest = ({ name, email }) =>
  respond(() => {
    const user = { id: `u${Date.now()}`, name, email, role: 'administrador', permissions: ['*'] };
    write(KEYS.user, user);
    announceUser();
    return { token: 'mock-token', user };
  });

export const logoutRequest = () => respond(() => null);

export const getCurrentUser = () => respond(peekCurrentUser);

export const updateProfile = (data) =>
  respond(() => {
    const name = String(data.name ?? '').trim();
    const email = String(data.email ?? '').trim();
    if (!name) throw fail(422, 'Indique o nome.');
    if (!/^\S+@\S+\.\S+$/.test(email)) throw fail(422, 'Indique um email válido.');
    const user = {
      ...peekCurrentUser(),
      name,
      email,
      telefone: String(data.telefone ?? '').trim(),
      cargo: String(data.cargo ?? '').trim(),
    };
    write(KEYS.user, user);
    if (user.role === 'administrador' && String(user.id) === String(readAdmin().id)) write(KEYS.admin, user);
    write(
      KEYS.collaborators,
      readCollaborators().map((item) =>
        String(item.id) === String(user.id)
          ? { ...item, nome: name, email: email.toLowerCase(), cargo: user.cargo }
          : item
      )
    );
    announceUser();
    return user;
  });

export const changePassword = ({ atual, nova }) =>
  respond(() => {
    if (atual !== currentPassword() && atual !== DEMO_CREDENTIALS.password) {
      throw fail(422, 'A senha atual está incorreta.');
    }
    if (String(nova ?? '').length < 8) throw fail(422, 'A nova senha deve ter pelo menos 8 caracteres.');
    localStorage.setItem(KEYS.password, nova);
    return null;
  });

/* Colaboradores (API) */
export const getCollaborators = () => respond(readCollaborators);

export const createCollaborator = (data) =>
  respond(() => {
    const item = normalizeCollaborator(data);
    const items = readCollaborators();
    validateCollaborator(item, items);
    const created = { ...item, id: nextId(items) };
    write(KEYS.collaborators, [...items, created]);
    return created;
  });

export const updateCollaborator = (id, data) =>
  respond(() => {
    const items = readCollaborators();
    const current = items.find((item) => String(item.id) === String(id));
    if (!current) throw fail(404, 'Colaborador não encontrado.');
    const item = { ...current, ...normalizeCollaborator({ ...current, ...data }) };
    validateCollaborator(item, items.filter((other) => String(other.id) !== String(id)));
    const me = peekCurrentUser();
    if (String(me.id) === String(id) && (!item.ativo || !item.permissions.includes('colaboradores.gerir'))) {
      throw fail(422, 'Não pode retirar a si próprio o acesso à gestão de colaboradores nem desativar a sua conta.');
    }
    write(KEYS.collaborators, items.map((other) => (String(other.id) === String(id) ? { ...item, id: current.id } : other)));
    return { ...item, id: current.id };
  });

export const deleteCollaborator = (id) =>
  respond(() => {
    if (String(peekCurrentUser().id) === String(id)) throw fail(422, 'Não pode remover a sua própria conta.');
    const items = readCollaborators();
    if (!items.some((item) => String(item.id) === String(id))) throw fail(404, 'Colaborador não encontrado.');
    write(KEYS.collaborators, items.filter((item) => String(item.id) !== String(id)));
    return null;
  });

/* Produtos */
export const getProducts = products.list;
export const getProduct = products.get;
export const createProduct = products.create;
export const updateProduct = products.update;
export const deleteProduct = products.remove;
export const importProducts = products.importMany;

/* Encomendas */
const readProducts = () => read(KEYS.products, MOCK_PRODUCTS);
const readOrders = () => read(KEYS.orders, MOCK_ORDERS);

const adjustStock = (productId, delta) => {
  write(
    KEYS.products,
    readProducts().map((product) =>
      String(product.id) === String(productId)
        ? { ...product, stock: Math.max(0, (Number(product.stock) || 0) + delta) }
        : product
    )
  );
};

export const getOrders = orders.list;
export const getOrder = orders.get;
export const importOrders = orders.importMany;

/** Regista a encomenda e abate o stock do produto. */
export const createOrder = (data) =>
  respond(() => {
    const product = readProducts().find((item) => String(item.id) === String(data.id_produto));
    if (!product) throw fail(422, 'Produto não encontrado.');
    const quantity = Number(data.quantidade) || 1;
    const stock = Number(product.stock) || 0;
    if (stock < quantity) {
      throw fail(422, `Stock insuficiente: restam ${stock} unidade(s) de "${product.nome}".`);
    }
    const items = readOrders();
    const order = { ...normalizeOrder({ ...data, estado: 'pendente' }), id: nextId(items) };
    write(KEYS.orders, [...items, order]);
    adjustStock(product.id, -quantity);
    return order;
  });

/** Muda o estado; cancelar devolve o stock, reativar volta a abatê-lo. */
export const updateOrderStatus = (id, estado) =>
  respond(() => {
    if (!ORDER_STATUS.some((status) => status.key === estado)) throw fail(422, 'Estado inválido.');
    const items = readOrders();
    const order = items.find((item) => String(item.id) === String(id));
    if (!order) throw fail(404, 'Encomenda não encontrada.');

    const quantity = Number(order.quantidade) || 1;
    if (order.estado !== 'cancelada' && estado === 'cancelada') {
      adjustStock(order.id_produto, quantity);
    } else if (order.estado === 'cancelada' && estado !== 'cancelada') {
      const product = readProducts().find((item) => String(item.id) === String(order.id_produto));
      if ((Number(product?.stock) || 0) < quantity) {
        throw fail(422, `Sem stock para reativar: restam ${Number(product?.stock) || 0} unidade(s).`);
      }
      adjustStock(order.id_produto, -quantity);
    }

    const updated = { ...order, estado };
    write(KEYS.orders, items.map((item) => (String(item.id) === String(id) ? updated : item)));
    return updated;
  });

/** Elimina a encomenda; se ainda estava em aberto, o stock volta ao armazém. */
export const deleteOrder = (id) =>
  respond(() => {
    const items = readOrders();
    const order = items.find((item) => String(item.id) === String(id));
    if (!order) throw fail(404, 'Encomenda não encontrada.');
    if (isOpen(order)) adjustStock(order.id_produto, Number(order.quantidade) || 1);
    write(KEYS.orders, items.filter((item) => String(item.id) !== String(id)));
    return null;
  });

/* Mensagens de clientes */
const readMessages = () =>
  read(
    KEYS.messages,
    MOCK_MESSAGES.map(({ hoursAgo, ...message }) => ({
      ...message,
      date: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
    }))
  );

export const getMessages = () => respond(() => [...readMessages()].sort((a, b) => b.date.localeCompare(a.date)));

export const markMessagesRead = (ids) =>
  respond(() => {
    const list = readMessages().map((message) =>
      ids === 'all' || ids.includes(message.id) ? { ...message, unread: false } : message
    );
    write(KEYS.messages, list);
    return list;
  });

/** Repõe os dados de demonstração iniciais. */
export const resetMockData = () => {
  [
    KEYS.products,
    KEYS.orders,
    KEYS.collaborators,
    KEYS.messages,
    KEYS.password,
    'mock:imports:produtos',
    'mock:imports:encomendas',
    'alertas:lidos',
  ].forEach((key) => localStorage.removeItem(key));
};
