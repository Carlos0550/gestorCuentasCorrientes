import React from 'react';
import './css/navbar.css';
import { IoMdMenu } from 'react-icons/io';

function Navbar({ children }) {
  const menuItem = [
    {
      name: 'Home',
      path: '/'
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
          <h1 className='nav__logo'>Logo</h1>

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
