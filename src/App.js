import React from 'react';
import './App.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import CrearUsuario from './pages/CrearUsuario';
import Navbar from './componentes/navbar/Navbar';
import Login from './Auth/Login';

function App() {
  return (
    <Navbar>
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login />} />
          <Route path= "/debtHistory" element={<Home />} />
          <Route path='/findClient' element={<Clientes />} />
          <Route path='/createUser' element={<CrearUsuario />} />
        
      </Routes>
    </Navbar>
  );
}

export default App;
