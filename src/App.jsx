import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/shared/Layout';
import Dashboard from './components/Dashboard';
import Produtos from './components/Produtos';
import Cliente from './components/Cliente';
import ProdutosAdd from './components/ProdutosAdd';
import Perfil from './components/auth/Perfil';
import EncomendaAdd from './components/EncomendaAdd';
import Encomenda from './components/Encomenda';
import Pagamentos from './components/Pagamentos';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="produtos/add" element={<ProdutosAdd/>}/>
          <Route path="encomendas/list" element={<Encomenda/>}/>
          <Route path="encomendas/add" element={<EncomendaAdd/>}/>
          <Route path='/cliente/:id' element={<Cliente/>}/>
          <Route path='/pagamento' element={<Pagamentos/>}/>
        </Route>
        <Route path='login' element={<>This is a login page</>}/>
      </Routes>
    </div>
  );
}

export default App;
