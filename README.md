# Andela Sweet Gift

Painel de gestão de produtos, encomendas, clientes e pagamentos.

## Stack

- React 19 + Vite 8
- Tailwind CSS 4
- React Router 7
- Recharts para gráficos
- Axios para a API

## Scripts

```bash
npm install       # instalar dependências
npm run dev       # servidor de desenvolvimento (http://localhost:5173)
npm run build     # build de produção para /dist
npm run preview   # pré-visualizar o build
```

`npm start` é um alias de `npm run dev`.

## Configuração

A URL da API é lida de `VITE_API_URL` (por omissão `http://localhost:8000`).
Crie um ficheiro `.env` com base em `.env.example` para apontar para outro servidor.

## Rotas

| Rota | Página |
| --- | --- |
| `/` | Dashboard |
| `/login`, `/registo` | Autenticação |
| `/produtos/list` | Lista de produtos |
| `/produtos/add` | Adicionar produto |
| `/produtos/:id/editar` | Editar produto |
| `/encomendas/list` | Lista de encomendas |
| `/encomendas/add` | Adicionar encomenda |
| `/encomendas/:id/editar` | Editar encomenda |
| `/clientes` | Lista de clientes |
| `/clientes/:id` | Detalhe do cliente |
| `/pagamento` | Transações |
| `/perfil` | Perfil |
| `/definicoes` | Definições |
| `/ajuda` | Ajuda & Apoio |
| `*` | 404 |

Os caminhos antigos (`/settings`, `/support`, `/register`, `/pagamentos`, `/cliente/:id`)
redirecionam para os equivalentes atuais.

## Estrutura

```
.
├── index.html            # entrypoint HTML do Vite
├── vite.config.js        # Vite + React + Tailwind
├── public/               # assets estáticos servidos na raiz
└── src/
    ├── main.jsx          # entrypoint React (BrowserRouter)
    ├── App.jsx           # definição das rotas
    ├── index.css         # Tailwind + tokens (fontes, botões, tabelas)
    ├── components/
    │   ├── layout/       # Layout, Header, Sidebar, AuthLayout
    │   ├── ui/           # Input, Alert, PageHeader, EmptyState, StatusBadge, ConfirmDialog
    │   └── dashboard/    # widgets do dashboard
    ├── pages/
    │   ├── Dashboard.jsx
    │   ├── NotFound.jsx
    │   ├── produtos/     # Produtos, ProdutosAdd, ProdutosEdit, ProdutoForm
    │   ├── encomendas/   # Encomenda, EncomendaAdd, EncomendaEdit, EncomendaForm
    │   ├── clientes/     # Clientes, Cliente
    │   ├── pagamentos/   # Pagamentos
    │   ├── definicoes/   # Definições
    │   ├── ajuda/        # Ajuda & Apoio
    │   └── auth/         # Login, Registo, Perfil
    └── lib/              # api, clientes, formatação, constantes e dados de exemplo
```

## Convenções

- Páginas (uma por rota) ficam em `src/pages/<área>/`.
- Componentes visuais reutilizáveis ficam em `src/components/`.
- Lógica/utilitários sem JSX ficam em `src/lib/`.
- Classes base (`.card`, `.btn`, `.input`, `.th`, `.td`, `.chip`) estão em `src/index.css`.
