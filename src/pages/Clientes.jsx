import React, { useState } from 'react';
import { useAppContext } from '../componentes/context';
import { IoPerson } from 'react-icons/io5';
import { MdPermIdentity, MdAttachEmail } from 'react-icons/md';
import { FaRegAddressCard } from 'react-icons/fa';

import AddDebt from '../componentes/debt/AddDebt';
import './css/clientes.css';

function Clientes() {
  const { findUser, buscandoUsuario, datosDelCliente,datosDeudor } = useAppContext();
  const [values, setValues] = useState({
    nombre: '',
    apellido: '',
    dni: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [debtActivate, setDebtActivate] = useState(false);
  const [buttonCount, setButtonCount] = useState(0);
const activateAddDebt = () => {
  setDebtActivate(true);
  setButtonCount(buttonCount + 1);
  if (buttonCount >= 1) {
    setDebtActivate(false);
    setButtonCount(0);
  }
}

  const sendData = (event) => {
    event.preventDefault();
    findUser(values);
  };

  return (
    <>
      <div className='wrapper__form-findUser'>
        <h1 className='findUser__h1'>Buscar Cliente</h1>
        <form className='findUser__form'>
          <label htmlFor='nombre' className='findUser__label'>
            <IoPerson /> Nombre:
            <input
              type='text'
              name='nombre'
              id='nombre'
              value={values.nombre}
              onChange={handleChange}
              className='findUser__input'
            />
          </label>

          <label htmlFor='apellido' className='findUser__label'>
            <MdPermIdentity /> Apellido:
            <input
              type='text'
              name='apellido'
              id='apellido'
              value={values.apellido}
              onChange={handleChange}
              className='findUser__input'
            />
          </label>

          <label htmlFor='dni' className='findUser__label'>
            <FaRegAddressCard /> DNI:
            <input
              type='number'
              name='dni'
              id='dni'
              value={values.dni}
              onChange={handleChange}
              className='findUser__input'
            />
          </label>

          <button
            onClick={sendData}
            className='findUser__button'
            disabled={buscandoUsuario}
            style={{ backgroundColor: buscandoUsuario ? 'grey' : '' }}
          >
            {buscandoUsuario ? 'Aguarde...' : 'Buscar Cliente'}
          </button>
        </form>
      </div>
      <div className='wrapper__form-findUser'>
        <div className='user__container'>
          {datosDelCliente ? datosDelCliente.map((item, index)=>{
            return(
              <div key={index}>
                <p># {index}</p>
                 <p>Nombre: {item.nombre}</p>
                 <p>Apellido: {item.apellido}</p>
                 <p>Deudor: {item.deudor}</p>
                 
                 {datosDeudor && datosDeudor ? datosDeudor.map((item,index)=>{
                  <div key={index}>
                    <p>Producto: {item.producto}</p>
                    <p>Cantidad: {item.cantidad}</p>
                    <p>Precio Unitario: precio unitario</p>
                  </div>
                 }): "El cliente no tiene deudas"}
              </div>
            )
            
          }) : ""}
        </div>
        {datosDeudor ? <button className='addDebt__button' onClick={activateAddDebt} style={{ backgroundColor: debtActivate ? 'red' : '' }}>{debtActivate ? "Cancelar" : "Añadir deuda"}</button>: ""}
          {debtActivate ? <AddDebt /> : ""}
      </div>
    </>
  );
}

export default Clientes;
