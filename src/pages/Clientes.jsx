import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useAppContext } from '../componentes/context';
import { IoPerson } from 'react-icons/io5';
import { MdPermIdentity, MdAttachEmail } from 'react-icons/md';
import { FaRegAddressCard } from 'react-icons/fa';
import Swal from 'sweetalert2';

import AddDebt from '../componentes/debt/AddDebt';
import './css/clientes.css';

import Example from '../componentes/modal/Example';
function Clientes() {
  const date = new Date()
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  let fullDateToday = `${day}/${month}/${year}`
  const { findUser, buscandoUsuario, datosDelCliente, datosDeudor, activateAddDebt, debtActivate, deleteIndividualDebt, cancelarFichero, verUltimaEntrega, ultimaEntrega } = useAppContext();
  useEffect(()=>{
    verUltimaEntrega()
  },[datosDeudor])
  const [payData, setPayData] = useState()
  function processingDebtChange() {
    let totalArs = 0;
    let totalUsd = 0;
    datosDeudor && datosDeudor.forEach(producto => {
      if (producto.moneda === "ARS") {
        totalArs += (producto.precio_unitario * producto.cantidad) - producto.monto_entrega;
      } else if (producto.moneda === "USD") {
        totalUsd += (producto.precio_unitario * producto.cantidad * 1200) - producto.monto_entrega;
      }
    });

    let total = totalUsd + totalArs;
    return total;
  }

  function procesarUltimaEntrega() {
    console.log("Ultima Entrega BD: ", verUltimaEntrega)
    let ultimaEntrega = 0;
    console.log("Datos del deudor: ", datosDeudor)
    datosDeudor && datosDeudor.forEach(producto => {
      if (producto.ultimo_estado_entrega > 0) {
        ultimaEntrega = `$${verUltimaEntrega && verUltimaEntrega	}ARS el día ${producto.dia_entrega	} por ${producto.nombre_producto	}`
      } else {
        ultimaEntrega = `No se registraron entregas`;
      }
    })
    return ultimaEntrega
  }

  const getIdDeleteProduct = (id) =>{    
    Swal.fire({
      title: "Eliminar el producto?",
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        deleteIndividualDebt(id)
      } else if (result.isDenied) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Eliminacion Cancelada"
        });
      }
    });
  }
  const deleteAllProducts = () =>{
    Swal.fire({
      title: `¿El cliente pagó todas sus deudas? 
      Esta accion eliminará todos los datos de su cuenta corriente!`,
      showDenyButton: true,
      confirmButtonText: "Si, cancelar fichero",
      denyButtonText: `Salir`
    }).then((result) => {
      if (result.isConfirmed) {
        cancelarFichero()
      } else if (result.isDenied) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Cancelado"
        });
      }
    });
  }
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
    
    findUser(values);
    setValues({
      nombre: '',
      apellido: '',
      dni: '',
    })
  };
  const [activateModal, setActivateModal] = useState(false)
  const [buttonModalCount, setButtonModalCount] = useState(0)
  const [show, setShow] = useState(false);

  const showModal = (index) => {
    setPayData(datosDeudor[index]);

    setActivateModal(true)
    setShow(true)
    setButtonModalCount(buttonModalCount + 1)

    if (buttonModalCount >= 1) {
      setActivateModal(false)
      setButtonModalCount(0)
      setShow(false)
    }

  }

  // useEffect(()=>{
  //   console.log("DAtos a mostrar: ", payData)
  // },[activateModal])

  // useEffect(() => {
  //   console.log("Datos del deudor: ", datosDeudor)
  // }, [datosDeudor])
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
            type='button'
            className='findUser__button'
            disabled={buscandoUsuario}
            style={{ backgroundColor: buscandoUsuario ? 'grey' : '' }}
          >
            {buscandoUsuario ? 'Aguarde...' : 'Buscar Cliente'}
          </button>
        </form>
      </div>
      <div className={datosDeudor ? 'wrapper__form-findUser' : ""}>

        <div className={datosDeudor ? 'user__container' : ""}>
          {datosDelCliente && datosDelCliente ? datosDelCliente.map((item, index) => {
            return (
              <div key={index}>
                <p>Nombre: {item.nombre}</p>
                <p>Apellido: {item.apellido}</p>
                <p>Correo Electronico: {item.email}</p>
                <p>DNI: {item.dni}</p>
                <p>Dirección: {item.direccion}</p>
                <p>Telefono/s: {item.telefono}</p>
                {datosDeudor ? <button className='addDebt__button' onClick={activateAddDebt} style={{ backgroundColor: debtActivate ? 'red' : '' }}>{debtActivate ? "Cancelar" : "Añadir producto al fichero"}</button> : ""}

              </div>

            )

          }) : ""}
          {debtActivate ? <AddDebt /> : ""}

        </div>
        <p className='fichero__title'>{datosDeudor ? "Fichero de " + datosDelCliente[0].nombre : ""}</p>

        <div className={datosDeudor && datosDeudor.length > 0 && datosDeudor ? 'fichero__cliente' : ""}>
          {datosDeudor && datosDeudor ? datosDeudor.map((item, index) => {

            return (
              <div key={index} className='fichero__container'>

                <div className="client-data">
                  <div>
                    <p><strong>#{index + 1}</strong></p>
                  </div>
                  <div>
                    <p><strong>Producto: </strong>{item.nombre_producto}</p>
                  </div>
                  <div>
                    <p><strong>Cantidad:</strong> {item.cantidad}</p>
                  </div>
                  <div>
                    <p><strong>Precio Unitario:</strong> ${item.precio_unitario}</p>
                  </div>
                  {item.moneda === "USD" && (
                    <div>
                      <strong>Conversión:</strong> ${item.precio_unitario * 1200}
                    </div>
                  )}
                  <div>
                    <p><strong>Fecha de compra:</strong> {item.fecha}</p>
                  </div>
                  <div>
                    <p><strong>Ultima entrega:</strong> {item.dia_entrega || "No se registran entregas a la fecha"}</p>
                  </div>
                  {item.monto_entrega !== 0 && (
                    <div>
                      <p><strong>Monto de entrega:</strong> ${item.monto_entrega  || "No se registran entregas a la fecha"}</p>
                    </div>
                  )}
                  <div>
                    <p><strong>Subtotal: </strong>${item.precio_unitario * item.cantidad} {item.moneda}</p>
                  </div>
                  
                  {item.moneda === "ARS" && (
                    <div>
                      <p><strong>Saldo: </strong>${item.precio_unitario * item.cantidad - item.monto_entrega} {item.moneda}</p>
                    </div>
                  )}
                  {item.moneda === "USD" && (
                    <div>
                      <p><strong>Saldo: </strong>${(item.precio_unitario * item.cantidad * 1200) - item.monto_entrega}ARS</p>
                    </div>
                  )}
                  <div className='fichero__buttons'>
                  {/* {datosDeudor && console.log("Antes de eliminar: ",item.id)} */}

                    <button onClick={() => getIdDeleteProduct(item.id)}>Eliminar</button>
                    <button onClick={() => showModal(index)}>Hacer entrega</button>

                  </div>
                  
                </div>

              </div>
            )
          }) : ""}
        </div>
        {datosDeudor && datosDeudor.length > 0 && datosDeudor ? <div className={datosDeudor && datosDeudor.length > 0 && datosDeudor ? "fichero__datos-finales" : ""}>
          {datosDeudor && datosDeudor ? <p className='fichero__total'><strong>Saldo Total: ${processingDebtChange()}</strong></p> : ""}
          {datosDeudor && datosDeudor ? <p className='fichero__total'><strong>Registro de entregas</strong></p> : ""}
          {datosDeudor && datosDeudor ? <p className='fichero__total'><strong><li>{procesarUltimaEntrega()}</li></strong></p> : ""}
          {datosDeudor && datosDeudor ? <button onClick={deleteAllProducts}>Cancelar o Hacer entrega</button> : ""}
        </div>: "No hay registros en el fichero"}
      </div>
      {activateModal ? <Example show={showModal} payData={payData} /> : ""}
    </>
  );
}

export default Clientes;
