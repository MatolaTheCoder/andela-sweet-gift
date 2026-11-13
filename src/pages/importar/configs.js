import { getProducts, importOrders, importProducts } from '../../lib/api';

const isBlank = (value) => String(value ?? '').trim() === '';
const isDate = (value) => isBlank(value) || !Number.isNaN(new Date(value).getTime());

export const PRODUTOS_IMPORT = {
  entity: 'produtos',
  breadcrumb: 'Produtos',
  title: 'Importar produtos',
  description: 'Carregue ficheiros CSV ou JSON para acrescentar produtos ao catálogo.',
  listPath: '/produtos/list',
  columns: ['nome', 'descricao', 'preco', 'categoria', 'stock', 'stock_minimo', 'data_criacao'],
  // As duas últimas linhas falham de propósito, para o modelo mostrar os dois resultados.
  sample: [
    ['Caneca térmica', 'Caneca térmica 350 ml com nome', '650', 'Casa', '20', '5', '2026-11-01'],
    ['Porta-chaves gravado', 'Porta-chaves em madeira com gravação', '250', 'Presentes', '40', '10', '2026-11-05'],
    ['Bombons artesanais', 'Caixa com 12 bombons', '420', 'Doces', '15', '5', '2026-11-06'],
    ['Pack de balões', 'Pack com 10 balões metalizados', '310', 'Decoração', '30', '8', '2026-11-07'],
    ['', 'Linha sem nome (exemplo de falha)', '100', 'Casa', '5', '2', '2026-11-05'],
    ['Vela aromática', 'Preço inválido (exemplo de falha)', 'abc', 'Casa', '5', '2', '2026-11-06'],
  ],
  describe: (row) => String(row.nome ?? '').trim(),
  validate: (row) => {
    if (isBlank(row.nome)) return 'Falta o nome do produto.';
    if (isBlank(row.preco)) return 'Falta o preço.';
    const preco = Number(row.preco);
    if (Number.isNaN(preco) || preco < 0) return `Preço inválido: "${row.preco}".`;
    if (!isBlank(row.stock) && !(Number(row.stock) >= 0)) return `Stock inválido: "${row.stock}".`;
    if (!isDate(row.data_criacao)) return `Data de criação inválida: "${row.data_criacao}".`;
    return null;
  },
  importMany: importProducts,
};

export const ENCOMENDAS_IMPORT = {
  entity: 'encomendas',
  breadcrumb: 'Encomendas',
  title: 'Importar encomendas',
  description: 'Carregue ficheiros CSV ou JSON para registar várias encomendas de uma vez.',
  listPath: '/encomendas/list',
  columns: [
    'id_produto',
    'quantidade',
    'valor',
    'solicitante',
    'genero',
    'idade',
    'destinatario',
    'endereco_destinatario',
    'data_criacao',
    'data_entrega',
  ],
  // As duas últimas linhas falham de propósito, para o modelo mostrar os dois resultados.
  sample: [
    ['1', '2', '1120', 'Joana Bila', 'F', '22', 'Mário Bila', 'Av. Mao Tsé-Tung, Maputo', '2026-11-10', '2026-11-14'],
    ['3', '1', '1299', 'Rui Langa', 'M', '52', 'Carla Langa', 'Bairro da Liberdade, Matola', '2026-11-11', '2026-11-15'],
    ['5', '3', '1497', 'Neusa Bila', 'F', '45', 'Rosa Bila', 'Bairro Central, Maputo', '2026-11-12', '2026-11-16'],
    ['999', '1', '500', 'Produto inexistente', 'F', '30', 'Exemplo de falha', 'Maputo', '2026-11-11', '2026-11-15'],
    ['2', '1', '799', '', 'M', '35', 'Sem solicitante (exemplo de falha)', 'Maputo', '2026-11-11', '2026-11-15'],
  ],
  loadContext: async () => new Set((await getProducts()).map((product) => String(product.id))),
  describe: (row) =>
    [row.solicitante, row.destinatario]
      .map((name) => String(name ?? '').trim())
      .filter(Boolean)
      .join(' → '),
  validate: (row, productIds) => {
    if (isBlank(row.id_produto)) return 'Falta o produto (id_produto).';
    if (!productIds.has(String(row.id_produto).trim())) {
      return `O produto nº ${row.id_produto} não existe no catálogo.`;
    }
    if (isBlank(row.solicitante)) return 'Falta o solicitante.';
    if (isBlank(row.destinatario)) return 'Falta o destinatário.';
    if (!isBlank(row.genero) && !/^[fm]/i.test(String(row.genero).trim())) {
      return `Género inválido: "${row.genero}". Use F ou M.`;
    }
    if (!isBlank(row.idade) && !(Number(row.idade) >= 14 && Number(row.idade) <= 110)) {
      return `Idade inválida: "${row.idade}".`;
    }
    if (!isBlank(row.quantidade) && !(Number(row.quantidade) >= 1)) {
      return `Quantidade inválida: "${row.quantidade}".`;
    }
    if (!isBlank(row.valor) && !(Number(row.valor) >= 0)) return `Valor inválido: "${row.valor}".`;
    if (!isDate(row.data_criacao) || !isDate(row.data_entrega)) return 'Data inválida.';
    return null;
  },
  importMany: importOrders,
};
