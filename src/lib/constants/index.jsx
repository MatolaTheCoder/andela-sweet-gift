import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineQuestionMarkCircle,
    HiOutlineCog,
    HiOutlineChevronDown,
} from 'react-icons/hi';

export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/',
        icon: <HiOutlineViewGrid />,
    },
    {
        key: 'productos',
        label: 'Produtos',
        path: '/produtos',
        icon: <HiOutlineCube />,
        children: [
            { key: 'produtosAdd', label: 'Adicionar', path: '/produtos/add' },
            { key: 'produtosList', label: 'Listar', path: '/produtos/list' },
        ],
    },
    {
        key: 'encomendas',
        label: 'Encomendas',
        path: '/encomendas',
        icon: <HiOutlineShoppingCart />,
        children: [
            { key: 'EncomendasAdd', label: 'Adicionar', path: '/encomendas/add' },
            { key: 'EncomendasList', label: 'Listar', path: '/encomendas/list' },
        ],
    },
    {
        key: 'customers',
        label: 'Clientes',
        path: '/customers',
        icon: <HiOutlineUsers />,
    },
    {
        key: 'transactions',
        label: 'Transacções',
        path: '/pagamento',
        icon: <HiOutlineDocumentText />,
    },
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
    {
        key: 'settings',
        label: 'Definições',
        path: '/settings',
        icon: <HiOutlineCog />,
    },
    {
        key: 'support',
        label: 'Ajuda & Apoio',
        path: '/support',
        icon: <HiOutlineQuestionMarkCircle />,
    },
];