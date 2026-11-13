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

## Funcionalidades
- **Encomendas** com estado (pendente, em preparação, entregue, cancelada), filtros, alertas de atraso e recibos interativos.
- **Produtos** com foto (pré-visualização em tempo real), categoria e stock; o stock desce ao registar uma encomenda e volta ao cancelar.
- **Colaboradores e permissões**: papéis (administrador, gestor, operador) e permissões por módulo; a interface esconde o que a conta não pode usar.
- **Pesquisa global** (Ctrl K), notificações e mensagens no cabeçalho.
- **Definições com efeito**: nome da loja, email, moeda (taxas fixas de demonstração), registos por página e alertas.
- Modo claro, escuro ou do sistema.
- Dados simulados no `localStorage`; os perfis de teste e a senha aparecem no ecrã de login.

## Testes
- `npm test`: testes unitários e de páginas (Vitest + Testing Library), incluindo verificações de acessibilidade com axe.
- O contraste de cor só é medido num navegador real; ver o histórico do projeto para a auditoria feita com axe-core.

## Rotas

| Rota | Página |
| --- | --- |
| `/` | Dashboard |
| `/login` | Autenticação (a criação de conta está desativada) |
| `/produtos/list` | Lista de produtos |
| `/encomendas/list` | Lista de encomendas |
| `/produtos/importar` | Importar produtos (CSV/JSON) |
| `/encomendas/importar` | Importar encomendas (CSV/JSON) |
| `/encomendas/:id/recibo` | Recibo e guia de entrega (imprimir/PDF) |
| `/calendario` | Calendário de entregas (mês e semana) |
| `/colaboradores` | Colaboradores e permissões |
| `/indicadores` | Indicadores: idade, género, categorias |
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
    │   ├── produtos/     # Produtos, ProdutoForm (adicionar/editar em modal)
    │   ├── encomendas/   # Encomenda, EncomendaForm (adicionar em modal)
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
