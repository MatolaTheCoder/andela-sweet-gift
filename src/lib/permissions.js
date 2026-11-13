/** Permissões da aplicação, agrupadas por módulo, e os papéis pré-definidos. */
export const PERMISSION_GROUPS = [
  {
    key: 'produtos',
    label: 'Produtos',
    items: [
      { key: 'produtos.ver', label: 'Ver produtos' },
      { key: 'produtos.criar', label: 'Adicionar produtos' },
      { key: 'produtos.editar', label: 'Editar produtos' },
      { key: 'produtos.eliminar', label: 'Eliminar produtos' },
      { key: 'produtos.importar', label: 'Importar produtos' },
    ],
  },
  {
    key: 'encomendas',
    label: 'Encomendas',
    items: [
      { key: 'encomendas.ver', label: 'Ver encomendas e calendário' },
      { key: 'encomendas.criar', label: 'Adicionar encomendas' },
      { key: 'encomendas.estado', label: 'Atualizar o estado' },
      { key: 'encomendas.eliminar', label: 'Eliminar encomendas' },
      { key: 'encomendas.importar', label: 'Importar encomendas' },
    ],
  },
  {
    key: 'analise',
    label: 'Clientes e análise',
    items: [
      { key: 'clientes.ver', label: 'Ver clientes' },
      { key: 'indicadores.ver', label: 'Ver indicadores' },
      { key: 'transacoes.ver', label: 'Ver transações' },
    ],
  },
  {
    key: 'administracao',
    label: 'Administração',
    items: [
      { key: 'colaboradores.gerir', label: 'Gerir colaboradores e permissões' },
      { key: 'definicoes.alterar', label: 'Alterar as definições da loja' },
    ],
  },
];

export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((group) => group.items.map((item) => item.key));

export const ROLES = [
  { key: 'administrador', label: 'Administrador', description: 'Acesso total, incluindo colaboradores e definições.' },
  { key: 'gestor', label: 'Gestor', description: 'Gere produtos, encomendas e análise; não gere colaboradores.' },
  { key: 'operador', label: 'Operador', description: 'Regista e acompanha encomendas; só consulta produtos e clientes.' },
];

const ROLE_PERMISSIONS = {
  administrador: ALL_PERMISSIONS,
  gestor: ALL_PERMISSIONS.filter((key) => key !== 'colaboradores.gerir' && key !== 'definicoes.alterar'),
  operador: [
    'produtos.ver',
    'encomendas.ver',
    'encomendas.criar',
    'encomendas.estado',
    'clientes.ver',
  ],
};

export const roleLabel = (role) => ROLES.find((item) => item.key === role)?.label ?? role;

/** Permissões que um papel traz por omissão (cópia, para poder editar). */
export const permissionsForRole = (role) => [...(ROLE_PERMISSIONS[role] ?? [])];

/** Verifica uma permissão numa lista (o administrador de demonstração tem "*"). */
export const hasPermission = (permissions, key) =>
  Array.isArray(permissions) && (permissions.includes('*') || permissions.includes(key));
