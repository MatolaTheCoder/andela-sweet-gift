import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineQuestionMarkCircle,
    HiOutlineCog,
    HiOutlineChartBar,
    HiOutlineCalendar,
    HiOutlineUserGroup,
} from 'react-icons/hi';

export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/',
        icon: <HiOutlineViewGrid />,
    },
    {
        key: 'produtos',
        label: 'Produtos',
        path: '/produtos',
        permission: 'produtos.ver',
        icon: <HiOutlineCube />,
        children: [
            { key: 'produtosList', label: 'Listar', path: '/produtos/list', permission: 'produtos.ver' },
            { key: 'produtosImport', label: 'Importar', path: '/produtos/importar', permission: 'produtos.importar' },
        ],
    },
    {
        key: 'encomendas',
        label: 'Encomendas',
        path: '/encomendas',
        permission: 'encomendas.ver',
        icon: <HiOutlineShoppingCart />,
        children: [
            { key: 'encomendasList', label: 'Listar', path: '/encomendas/list', permission: 'encomendas.ver' },
            { key: 'encomendasImport', label: 'Importar', path: '/encomendas/importar', permission: 'encomendas.importar' },
        ],
    },
    {
        key: 'calendario',
        label: 'Calendário',
        path: '/calendario',
        permission: 'encomendas.ver',
        icon: <HiOutlineCalendar />,
    },
    {
        key: 'clientes',
        label: 'Clientes',
        path: '/clientes',
        permission: 'clientes.ver',
        icon: <HiOutlineUsers />,
    },
    {
        key: 'indicadores',
        label: 'Indicadores',
        path: '/indicadores',
        permission: 'indicadores.ver',
        icon: <HiOutlineChartBar />,
    },
    {
        key: 'transacoes',
        label: 'Transações',
        path: '/pagamento',
        permission: 'transacoes.ver',
        icon: <HiOutlineDocumentText />,
    },
    {
        key: 'colaboradores',
        label: 'Colaboradores',
        path: '/colaboradores',
        permission: 'colaboradores.gerir',
        icon: <HiOutlineUserGroup />,
    },
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
    {
        key: 'definicoes',
        label: 'Definições',
        path: '/definicoes',
        permission: 'definicoes.alterar',
        icon: <HiOutlineCog />,
    },
    {
        key: 'ajuda',
        label: 'Ajuda & Apoio',
        path: '/ajuda',
        icon: <HiOutlineQuestionMarkCircle />,
    },
];
