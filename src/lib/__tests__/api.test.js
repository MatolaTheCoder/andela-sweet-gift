import { brandEmail } from '../brand';
import {
  createCollaborator,
  createOrder,
  deleteCollaborator,
  deleteOrder,
  getCollaborators,
  getErrorMessage,
  getProducts,
  loginRequest,
  peekCurrentUser,
  updateCollaborator,
  updateOrderStatus,
} from '../api';

const orderOf = (id_produto, quantidade) => ({
  id_produto,
  quantidade,
  valor: 100,
  solicitante: 'Ana',
  destinatario: 'Rui',
  endereco_destinatario: 'Maputo',
});

const stockOf = async (id) => (await getProducts()).find((product) => product.id === id).stock;

beforeEach(() => localStorage.clear());

describe('encomendas e stock', () => {
  it('abate o stock ao registar uma encomenda', async () => {
    const before = await stockOf(1);
    await createOrder(orderOf(1, 2));
    expect(await stockOf(1)).toBe(before - 2);
  });

  it('recusa quando não há stock suficiente', async () => {
    const error = await createOrder(orderOf(7, 1)).catch((e) => e); // produto 7 está esgotado
    expect(getErrorMessage(error)).toContain('Stock insuficiente');
    expect(await stockOf(7)).toBe(0);
  });

  it('cancelar devolve o stock e reativar volta a abatê-lo', async () => {
    const before = await stockOf(1);
    const order = await createOrder(orderOf(1, 3));
    await updateOrderStatus(order.id, 'cancelada');
    expect(await stockOf(1)).toBe(before);
    await updateOrderStatus(order.id, 'pendente');
    expect(await stockOf(1)).toBe(before - 3);
  });

  it('eliminar uma encomenda em aberto devolve o stock', async () => {
    const before = await stockOf(2);
    const order = await createOrder(orderOf(2, 1));
    await deleteOrder(order.id);
    expect(await stockOf(2)).toBe(before);
  });

  it('rejeita estados que não existem', async () => {
    const order = await createOrder(orderOf(1, 1));
    const error = await updateOrderStatus(order.id, 'voou').catch((e) => e);
    expect(getErrorMessage(error)).toContain('inválido');
  });
});

describe('colaboradores e acesso', () => {
  it('adiciona um colaborador com as permissões do papel', async () => {
    const created = await createCollaborator({ nome: 'Rita', email: 'Rita@loja.mz', role: 'operador' });
    expect(created.email).toBe('rita@loja.mz');
    expect(created.permissions).toContain('encomendas.criar');
    expect(created.permissions).not.toContain('encomendas.eliminar');
  });

  it('recusa emails repetidos', async () => {
    const [first] = await getCollaborators();
    const error = await createCollaborator({ nome: 'Outro', email: first.email, role: 'operador' }).catch((e) => e);
    expect(getErrorMessage(error)).toContain('Já existe');
  });

  it('um colaborador ativo entra com a senha de demonstração e fica com as suas permissões', async () => {
    const { user } = await loginRequest({ email: brandEmail('armando'), password: 'demo1234' });
    expect(user.role).toBe('operador');
    expect(peekCurrentUser().permissions).not.toContain('colaboradores.gerir');
  });

  it('um colaborador desativado não consegue entrar', async () => {
    const error = await loginRequest({ email: brandEmail('fatima'), password: 'demo1234' }).catch((e) => e);
    expect(error.response.status).toBe(401);
  });

  it('o administrador não se pode remover nem retirar a gestão de colaboradores', async () => {
    const [admin] = (await getCollaborators()).filter((item) => item.role === 'administrador');
    expect(getErrorMessage(await deleteCollaborator(admin.id).catch((e) => e))).toContain('própria conta');
    const error = await updateCollaborator(admin.id, { permissions: ['produtos.ver'] }).catch((e) => e);
    expect(getErrorMessage(error)).toContain('si próprio');
  });
});
