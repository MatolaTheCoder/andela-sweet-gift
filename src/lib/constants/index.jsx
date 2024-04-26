import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineQuestionMarkCircle,
    HiOutlineCog
} from 'react-icons/hi'

export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/',
        icon: <HiOutlineViewGrid/>
    },
    {
        key: 'products',
        label: 'Productos',
        path: '/produtos',
        icon: <HiOutlineCube/>
    },
    {
        key: 'orders',
        label: 'Encomendas',
        path: '/orders',
        icon: <HiOutlineShoppingCart/>
    },
    {
        key: 'customers',
        label: 'Clientes',
        path: '/customers',
        icon: <HiOutlineUsers/>
    },
    {
        key: 'transactions',
        label: 'Transaccoes',
        path: '/transactions',
        icon: <HiOutlineDocumentText/>        
    }
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS=[
    {
        key: 'settings',
        label: 'Definicoes',
        path: '/settings',
        icon: <HiOutlineCog/>
    },
    {
        key: 'support',
        label: 'Ajuda & Apoio',
        path: '/support',
        icon: <HiOutlineQuestionMarkCircle/>
    }
]

