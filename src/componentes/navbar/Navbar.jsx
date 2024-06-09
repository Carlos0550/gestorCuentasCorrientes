import React, { useEffect, useState } from 'react';
import './css/navbar.css'; // Asegúrate de que la ruta sea correcta según tu estructura de archivos
import { IoMdMenu } from 'react-icons/io';
import { useAppContext } from '../context';
import { supabase } from '../../Auth/supabase';

function Navbar({ children }) {
  const { closeSession, loggingIn } = useAppContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [executionCount, setExecutionCount] = useState(0)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setExecutionCount(prevCount => prevCount + 1);
    }, 500);
    if (executionCount >= 20) {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data && data.session) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    fetchSession();
  }, [executionCount]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const menuItem = [
    {
      name: 'Buscar Historial',
      path: '/debtHistory'
    },
    {
      name: 'Añadir Deuda',
      path: '/findClient'
    },
    {
      name: 'Registrar Cliente',
      path: '/createUser'
    }
  ];

  return (
    <>
      <header>
        <h1 className='logo'>Gestion Corriente</h1>
        <button className='abrir_menu' onClick={toggleMenu}>
          <IoMdMenu className='menu_icon' />
        </button>
        <nav className={`nav ${isMenuOpen ? 'visible' : ''}`}>
          <button className='cerrar_menu' onClick={closeMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="auto" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </button>
          <ul className='nav-list'>
            {menuItem.map((item, index) => (
              <li key={index}>
                <a href={item.path}>{item.name}</a>
              </li>
            ))}
          </ul>
          {isLoggedIn && (
            <button className='nav__item-button-logout' onClick={closeSession}>
              {isLoggedIn ? (loggingIn ? "Aguarde..." : "Cerrar Sesión") : ""}
            </button>
          )}
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}

export default Navbar;
