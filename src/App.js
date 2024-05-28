import React from 'react';
import './App.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import CrearUsuario from './pages/CrearUsuario';
import Navbar from './componentes/navbar/Navbar';

function App() {
  return (
    <Navbar>
      <Routes>
        <Route path='/' element={<Outlet />}>
          <Route index element={<Home />} />
          <Route path='/findClient' element={<Clientes />} />
          <Route path='/createUser' element={<CrearUsuario />} />
        </Route>
      </Routes>
    </Navbar>
  );
}

export default App;
