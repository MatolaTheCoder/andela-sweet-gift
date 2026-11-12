import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineQuestionMarkCircle,
    HiOutlineCog,
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
        icon: <HiOutlineCube />,
        children: [
            { key: 'produtosList', label: 'Listar', path: '/produtos/list' },
            { key: 'produtosAdd', label: 'Adicionar', path: '/produtos/add' },
        ],
    },
    {
        key: 'encomendas',
        label: 'Encomendas',
        path: '/encomendas',
        icon: <HiOutlineShoppingCart />,
        children: [
            { key: 'encomendasList', label: 'Listar', path: '/encomendas/list' },
            { key: 'encomendasAdd', label: 'Adicionar', path: '/encomendas/add' },
        ],
    },
    {
        key: 'clientes',
        label: 'Clientes',
        path: '/clientes',
        icon: <HiOutlineUsers />,
    },
    {
        key: 'transacoes',
        label: 'Transações',
        path: '/pagamento',
        icon: <HiOutlineDocumentText />,
    },
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
    {
        key: 'definicoes',
        label: 'Definições',
        path: '/definicoes',
        icon: <HiOutlineCog />,
    },
    {
        key: 'ajuda',
        label: 'Ajuda & Apoio',
        path: '/ajuda',
        icon: <HiOutlineQuestionMarkCircle />,
    },
];
