import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/produtos/Produtos';
import Encomenda from './pages/encomendas/Encomenda';
import Clientes from './pages/clientes/Clientes';
import Cliente from './pages/clientes/Cliente';
import Pagamentos from './pages/pagamentos/Pagamentos';
import Definicoes from './pages/definicoes/Definicoes';
import Ajuda from './pages/ajuda/Ajuda';
import Indicadores from './pages/indicadores/Indicadores';
import ImportPage from './pages/importar/ImportPage';
import { ENCOMENDAS_IMPORT, PRODUTOS_IMPORT } from './pages/importar/configs';
import NotFound from './pages/NotFound';
import Recibo from './pages/encomendas/Recibo';
import Calendario from './pages/calendario/Calendario';
import Colaboradores from './pages/colaboradores/Colaboradores';
import { RequirePermission } from './lib/auth';
import Login from './pages/auth/Login';
// Criação de conta desativada por agora:
// import Registo from './pages/auth/Registo';
import Perfil from './pages/auth/Perfil';

/** Mostra a página só a quem tem a permissão. */
const guard = (permission, element) => (
  <RequirePermission permission={permission}>{element}</RequirePermission>
);

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Criação de conta desativada por agora:
        <Route path="/registo" element={<Registo />} />
        <Route path="/register" element={<Navigate to="/registo" replace />} />
        */}

        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="perfil" element={<Perfil />} />

          <Route path="produtos" element={<Navigate to="list" replace />} />
          <Route path="produtos/list" element={guard('produtos.ver', <Produtos />)} />
          <Route path="produtos/add" element={<Navigate to="/produtos/list?novo=1" replace />} />
          <Route
            path="produtos/importar"
            element={guard('produtos.importar', <ImportPage key="produtos" config={PRODUTOS_IMPORT} />)}
          />
          <Route path="produtos/:id/editar" element={<Navigate to="/produtos/list" replace />} />

          <Route path="encomendas" element={<Navigate to="list" replace />} />
          <Route path="encomendas/list" element={guard('encomendas.ver', <Encomenda />)} />
          <Route path="encomendas/:id/recibo" element={guard('encomendas.ver', <Recibo />)} />
          <Route path="calendario" element={guard('encomendas.ver', <Calendario />)} />
          <Route path="colaboradores" element={guard('colaboradores.gerir', <Colaboradores />)} />
          <Route path="encomendas/add" element={<Navigate to="/encomendas/list?novo=1" replace />} />
          <Route
            path="encomendas/importar"
            element={guard('encomendas.importar', <ImportPage key="encomendas" config={ENCOMENDAS_IMPORT} />)}
          />

          <Route path="clientes" element={guard('clientes.ver', <Clientes />)} />
          <Route path="clientes/:id" element={guard('clientes.ver', <Cliente />)} />
          <Route path="cliente/:id" element={guard('clientes.ver', <Cliente />)} />

          <Route path="indicadores" element={guard('indicadores.ver', <Indicadores />)} />

          <Route path="pagamento" element={guard('transacoes.ver', <Pagamentos />)} />
          <Route path="pagamentos" element={<Navigate to="/pagamento" replace />} />

          <Route path="definicoes" element={guard('definicoes.alterar', <Definicoes />)} />
          <Route path="settings" element={<Navigate to="/definicoes" replace />} />
          <Route path="ajuda" element={<Ajuda />} />
          <Route path="support" element={<Navigate to="/ajuda" replace />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
