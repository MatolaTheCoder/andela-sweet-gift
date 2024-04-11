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
        <Route path='login' element={<>This is a login page</>}/>
      </Routes>
    </div>
  );
}

export default App;
