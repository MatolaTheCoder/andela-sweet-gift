import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/shared/Layout';
import Dashboard from './components/Dashboard';
import Produtos from './components/Produtos';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="produtos" element={<Produtos />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
