import React, { useState } from 'react'
import { IoPerson } from 'react-icons/io5';
import { FaRegAddressCard } from 'react-icons/fa';
import "./css/home.css"
import { useAppContext } from '../componentes/context'
function Home() {
  const { debtHistory,obtenerHistorial, buscandoUsuario } = useAppContext()

  const date = new Date()
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  let fullDate = `${day}/${month}/${year}`

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


  const sendData = (event) => {
    event.preventDefault();
    obtenerHistorial(values)
    //busqueda de usuario
    setValues({
      nombre: '',
      dni: '',
    })
  };
  return (
    <div>
      <div className='wrapper__form-findUser'>
        <h1 className='findUser__h1'>Buscar Historial de cliente</h1>
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
            type='button'
            className='findUser__button'
            disabled={buscandoUsuario}
            style={{ backgroundColor: buscandoUsuario ? 'grey' : '' }}
          >
            {buscandoUsuario ? 'Aguarde...' : 'Buscar Cliente'}
          </button>
        </form>
      </div>
      {console.log("Historial de duedas: ", debtHistory)}
      {debtHistory && debtHistory.length > 0 ? (
        <div className='wrapper__show-history'>
          {debtHistory && debtHistory.length > 0 && <p className='p__client-name'>Historial de {debtHistory.map((item)=> item.nombre_cliente)[0]}</p>}
          {debtHistory.map((item, index) => (
            <div key={index} className='wrapper-products'>
              <p>{item.cantidad} {item.nombre_producto}</p>
              
              {item.moneda === "ARS" ? (
                <p>Total: ${item.precio_producto * item.cantidad}</p>
              ) : (
                <p>Total: ${(item.precio_producto * 1200)* item.cantidad}</p>
              )}
              <p>Fecha de compra: {item.fecha_compra}</p>
              <p>Fecha de cancelación: {item.fecha_de_cancelacion}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className='wrapper__show-history'>
          <p>Empiece a buscar un usuario por su DNI o Nombre</p>
        </div>
      )}


    </div>
  )
}

export default Home