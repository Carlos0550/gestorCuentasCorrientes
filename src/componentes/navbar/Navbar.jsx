import React, { useEffect, useState } from 'react';
import './css/navbar.css';
import { IoMdMenu } from 'react-icons/io';
import { useAppContext } from '../context';
import { supabase } from '../../Auth/supabase';
function Navbar({ children }) {
  const { closeSession, loggingIn } = useAppContext();
  const [isLoggedIn, setIsLoggedIn] = useState(null)
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
    if (executionCount > 0 && executionCount % 2 === 0) {
      (async () => {
        const { data, error } = await supabase.auth.getSession();
        if (data.session) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }

      })();
    }
  }, [executionCount]);
  const menuItem = [
    {
      name: 'Home',
      path: '/debtHistory'
    },
    {
      name: 'Clientes',
      path: '/findClient'
    },
    {
      name: 'Registrar Usuario',
      path: '/createUser'
    }
  ];

  return (
    <>
      <nav>
        <div className='nav__container'>
          <h1 className='nav__logo'>Gestión Corriente</h1>
          {isLoggedIn && <button className='nav__item-button' onClick={closeSession}>{loggingIn ? "Aguarde..." : "Cerrar Sesion"}</button>}

          <label htmlFor='menu' className='nav__label'>
            <IoMdMenu />
          </label>


          <input type='checkbox' id='menu' className='nav__input' />
          <div className='nav__menu'>
            {menuItem.map((item, index) => (
              <div key={index}>
                <a href={item.path} className='nav__item'>
                  <button className='nav__item-button'>{item.name}</button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
}

export default Navbar;
