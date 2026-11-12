import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/produtos/Produtos';
import ProdutosAdd from './pages/produtos/ProdutosAdd';
import ProdutosEdit from './pages/produtos/ProdutosEdit';
import Encomenda from './pages/encomendas/Encomenda';
import EncomendaAdd from './pages/encomendas/EncomendaAdd';
import EncomendaEdit from './pages/encomendas/EncomendaEdit';
import Clientes from './pages/clientes/Clientes';
import Cliente from './pages/clientes/Cliente';
import Pagamentos from './pages/pagamentos/Pagamentos';
import Definicoes from './pages/definicoes/Definicoes';
import Ajuda from './pages/ajuda/Ajuda';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Registo from './pages/auth/Registo';
import Perfil from './pages/auth/Perfil';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registo" element={<Registo />} />
        <Route path="/register" element={<Navigate to="/registo" replace />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="perfil" element={<Perfil />} />

          <Route path="produtos" element={<Navigate to="list" replace />} />
          <Route path="produtos/list" element={<Produtos />} />
          <Route path="produtos/add" element={<ProdutosAdd />} />
          <Route path="produtos/:id/editar" element={<ProdutosEdit />} />

          <Route path="encomendas" element={<Navigate to="list" replace />} />
          <Route path="encomendas/list" element={<Encomenda />} />
          <Route path="encomendas/add" element={<EncomendaAdd />} />
          <Route path="encomendas/:id/editar" element={<EncomendaEdit />} />

          <Route path="clientes" element={<Clientes />} />
          <Route path="clientes/:id" element={<Cliente />} />
          <Route path="cliente/:id" element={<Cliente />} />

          <Route path="pagamento" element={<Pagamentos />} />
          <Route path="pagamentos" element={<Navigate to="/pagamento" replace />} />

          <Route path="definicoes" element={<Definicoes />} />
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
