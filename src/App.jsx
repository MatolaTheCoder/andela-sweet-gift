
import React from 'react'
import { Route,Routes } from 'react-router-dom';
import Root from './routes/root';
import Layout from './components/shared/Layout';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Root/>}/>
        <Route path='/contacts' element={<Layout/>}/>
        <Route/>
      </Routes>
    </div>
  );
}

export default App;
