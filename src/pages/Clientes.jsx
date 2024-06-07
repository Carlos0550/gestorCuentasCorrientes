import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useAppContext } from '../componentes/context';
import { IoPerson } from 'react-icons/io5';
import { MdPermIdentity, MdAttachEmail } from 'react-icons/md';
import { FaRegAddressCard } from 'react-icons/fa';
import Swal from 'sweetalert2';

import AddDebt from '../componentes/debt/AddDebt';
import './css/clientes.css';

import Example from '../componentes/modal/Example';
import PagosTotales from '../componentes/modal/PagosTotales';
import EditarDatosCliente from '../componentes/modal/EditarDatosCliente';

import { supabase } from '../Auth/supabase';
import { useNavigate } from 'react-router-dom';
function Clientes() {
  const navigate = useNavigate()
  useEffect(()=>{
    (async ()=>{
        const { data, error } = await supabase.auth.getSession()
        if (!data.session) {
            navigate('/login')
        }
    })()
},[])
  const date = new Date()
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  let fullDateToday = `${day}/${month}/${year}`
  const { findUser, buscandoUsuario, datosDelCliente, datosDeudor, activateAddDebt, debtActivate, deleteIndividualDebt, cancelarFichero, pagosTotalesData,
    getRegistersPays, getRegisterPaysData

  } = useAppContext();

  const [payData, setPayData] = useState()
  function processingDebtChange() {
    let totalArs = 0;
    let totalUsd = 0;

    datosDeudor && datosDeudor.forEach(producto => {
      if (producto.moneda === "ARS") {
        totalArs += (producto.precio_unitario * producto.cantidad) - parseInt(producto.monto_entrega || 0);
      } else if (producto.moneda === "USD") {
        totalUsd += (producto.precio_unitario * producto.cantidad * 1200) - parseInt(producto.monto_entrega || 0);
      }
    });

    let total = totalUsd + totalArs;
    // console.log("Total", total)

    return total;
  }

  const processingTotalChange = () => {
    let total
    pagosTotalesData && pagosTotalesData.forEach(producto => {
      total = parseInt(producto.monto_entrega || 0)
    })
    return total
  }
  
  const SaldoTotalParaModal = () => {
    let total = 0;
    total = parseInt((processingDebtChange() || 0) - (processingTotalChange() || 0));
    return total;
  };


  const getIdDeleteProduct = (id) => {
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
  let oneProduct = datosDeudor && datosDeudor.length == 1 ? datosDeudor.map((item)=> item.precio_unitario)[0] : 0
 
  const deleteAllProducts = () => {
    // let formData = new FormData()
    
    Swal.fire({
      title: `¿Esta seguro?
              Podrá ver el historial del cliente en home`,
      showDenyButton: true,
      confirmButtonText: "Cancelar fichero",
      denyButtonText: `Salir`
    }).then((result) => {
      if (result.isConfirmed) {

        
        setTimeout(() => {
          cancelarFichero(datosDeudor, datosDelCliente)
        }, 500);
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
          title: "Operacion Cancelada"
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


  const [activateModalEntregasTotales, setActivateModalEntregasTotales] = useState(false)
  const [buttonModalCountModalEntregasTotales, setButtonModalCountModalEntregasTotales] = useState(0)
  const [showModalEntregasTotales, setShowModalEntregasTotales] = useState(false);
  const [entregasTotalesData, setEntregasTotalesData] = useState()
  const mostrarModalEntregasTotales = () => {
    setEntregasTotalesData(datosDeudor)
    setActivateModalEntregasTotales(true)
    setShowModalEntregasTotales(true)
    setButtonModalCountModalEntregasTotales(buttonModalCountModalEntregasTotales + 1)

    if (buttonModalCountModalEntregasTotales >= 1) {
      setActivateModalEntregasTotales(false)
      setShowModalEntregasTotales(false)
      setButtonModalCountModalEntregasTotales(0)
    }
  }

  const [activateEditClientDataModal, setActivateClientDataModal] = useState(false)
  const [buttonCountModalClientData, setButtonCountModalClientData] = useState(0)
  const [showModalEditClientData, setShowModalClientData] = useState(false)
  const editClientData = (id) =>{
    // console.log("Editar producto con id",id)
    setActivateClientDataModal(true)
    setShowModalClientData(true)
    setButtonCountModalClientData(buttonCountModalClientData + 1)
    if (buttonCountModalClientData) {
      setActivateClientDataModal(false)
      setShowModalClientData(false)
      setButtonCountModalClientData(0)
    }
    
  }

 

  const saldoTotal = SaldoTotalParaModal() || "0";



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
                <div className='fichero__buttons'>
                  <button className='addDebt__button' onClick={editClientData}>Editar datos</button>
                  <button className='addDebt__button'
                  disabled={saldoTotal === 0 || saldoTotal < 0}
                  onClick={activateAddDebt}
                  style={{ backgroundColor: debtActivate ? 'red' : '' }}>
                  {debtActivate ? "Cancelar" : "Añadir producto al fichero"}
                </button>
                </div>
              </div>

            )

          }) : ""}
          {debtActivate ? <AddDebt /> : ""}

        </div>
        <p className='fichero__title'>{datosDeudor ? "Fichero de " + datosDelCliente[0].nombre + " " + datosDelCliente[0].apellido : ""}</p>
        <div className={datosDeudor && datosDeudor.length > 0 && datosDeudor ? 'fichero__cliente' : ""}>
          {datosDeudor && datosDeudor ? datosDeudor.map((item, index) => {

            return (
              <div key={index} className='fichero__container'>

                <div className="client-data">
                  <div>
                    <p><strong>{item.nombre_producto}</strong></p>
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
                  {/* <div>
                    <p><strong>Ultima entrega:</strong> {item.dia_entrega || "No se registran entregas a la fecha"}</p>
                  </div>
                  {item.monto_entrega !== 0 && (
                    <div>
                      <p><strong>Monto de entrega:</strong> ${item.monto_entrega || "No se registran entregas a la fecha"}</p>
                    </div>
                  )} */}
                  {/* <div>
                    <p><strong>Subtotal: </strong>${item.precio_unitario * item.cantidad} {item.moneda}</p>
                  </div> */}

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

                    <button onClick={() => getIdDeleteProduct(item.id)}
                    disabled={oneProduct }
                    style={{backgroundColor: oneProduct  ? "grey" : ""}}
                    >Eliminar</button>
                    <button >Editar Producto</button>
                    {/* <button onClick={() => showModal(index)} disabled={(processingDebtChange() - processingTotalChange()) == 0}
                      style={{ backgroundColor: (processingDebtChange() - processingTotalChange()) == 0 ? 'grey' : '' }}
                    >Hacer entrega</button> */}

                  </div>

                </div>

              </div>
            )
          }) : ""}
        </div>
        {datosDeudor && datosDeudor.length > 0 ? (
          <div className="fichero__datos-finales">
            <p className="fichero__total"><strong>Saldo Total: ${SaldoTotalParaModal()}</strong></p>
            <div>
              {saldoTotal < 0 && (
                <p style={{ color: "red" }}>
                  Se quitaron uno o más productos que superan el monto total de las entregas,
                  el dinero a favor del cliente es de: <strong>${Math.abs(saldoTotal)}</strong>
                </p>
              )}
            </div>
            <div>
              {(saldoTotal < 0 || saldoTotal == 0) && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  La cuenta ya esta en 0, haca click en <strong>Cancelar cuenta</strong> para guardar y limpiar esta sección
                </p>
              )}
            </div>
            <button onClick={deleteAllProducts}>Cancelar cuenta</button>
            <button onClick={mostrarModalEntregasTotales} disabled={saldoTotal < 0 || saldoTotal == 0}
              style={{ backgroundColor: saldoTotal < 0 || saldoTotal == 0 ? 'grey' : '' }}
            >Hacer una entrega</button>
            <p className="fichero__total"><strong>Registro de entregas</strong></p>
            {getRegisterPaysData && getRegisterPaysData.length > 0 ? (
              getRegisterPaysData.map((item, index) => (
                <div key={index}>
                  <div>
                    <p><strong>{item.fecha_entrega}:</strong> Se entregó: <strong>${item.monto_entrega}</strong></p>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay registros en el fichero</p>
            )}
          </div>
        ) : (
          <p></p>
        )}


      </div>
      {activateModal ? <Example show={showModal} payData={payData} /> : ""}
      {activateModalEntregasTotales ? <PagosTotales mostrarModalEntregasTotales={mostrarModalEntregasTotales} entregasTotalesData={entregasTotalesData} saldoTotal={SaldoTotalParaModal()} /> : ""}
      {activateEditClientDataModal ? <EditarDatosCliente mostrarModal={editClientData}></EditarDatosCliente>: ""}
    </>
  );
}

export default Clientes;
