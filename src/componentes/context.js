import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { supabase } from "../Auth/supabase";
import { useNavigate } from 'react-router-dom'

export const AppContext = createContext();

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return ctx;
};

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate()

  const [creandoUsuario, setCreandoUsuario] = useState(false)
  const [datosDelCliente, setDatosDelCliente] = useState(null)
  const [nombreCompleto, setNombreCompleto] = useState(null)
  const createUser = async (values) => {
    setCreandoUsuario(true)
    try {
      const response = await axios.post("https://gestioncorrienteserver-production.up.railway.app/api/clients/create", values);
      console.log("Response:", response.data);

      if (response.status === 201) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "201: Usuario creado Exitosamente"
        });
      }
    } catch (error) {
      if (error.response.status === 409) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "409: Ya existe un usuario con ese DNI"
        });
      } else if (error.response.status === 501) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "501: Ocurrio un error interno en el servidor"
        });
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "Unknow: Ocurrio un error desconocido"
        });
        console.log(error)
      }
    } finally {
      setTimeout(() => {
        setCreandoUsuario(false)
      }, 500);
    }
  };
  const [idDeudor, setIdDeudor] = useState(null)
  const [buscandoUsuario, setBuscandoUsuario] = useState(false)
  const findUser = async (values) => {

    setBuscandoUsuario(true)
    try {
      const response = await axios.post("https://gestioncorrienteserver-production.up.railway.app/api/clients/find", values)
      setDatosDelCliente(response.data)

      // console.log(response.data)
      if (response.status === 201) {
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
          title: "Cliente Encontrado"
        });
      }
    } catch (error) {
      if (error.response.status === 500) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "500: Ocurrió un error al buscar el cliente"
        });
      } else if (error.response.status === 404) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "500: No existe un usuario con ese criterio de Busqueda"
        });
      } else if (error.response.status === 201) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "201: Mostrando información del cliente"
        });
      } else if (error.response.status === 400) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "400: Debe proporcionar nombre, apellido o dni para la búsqueda."
        });
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "Unknow: Error desconocido"
        });
      }
    } finally {
      setTimeout(() => {
        setBuscandoUsuario(false)
      }, 500);
    }
  }
  useEffect(() => {
    datosDelCliente && datosDelCliente.map((item) => {
      setNombreCompleto(`${item.nombre} ${item.apellido}`)
    })
  }, [datosDelCliente])

  const [datosDeudor, setDatosDeudor] = useState(null)
  useEffect(() => {
    if (datosDelCliente && datosDelCliente.length > 0) {
      datosDelCliente.forEach(async (item) => {
        setIdDeudor(item.id_deudor);

        try {
          const response = await axios.post("https://gestioncorrienteserver-production.up.railway.app/api/clients/retrieveDebtCustomer", { idDeudor });
          setDatosDeudor(response.data)
          // console.log("Deudas del cleinte recuperadas", response.data);
        } catch (error) {
          console.log("Error al recuperar deuda del cliente:", error);
        }
      });
    }
  }, [datosDelCliente, idDeudor]);
  const traerDatosDeudor = () => {
    if (datosDelCliente && datosDelCliente.length > 0) {
      datosDelCliente.forEach(async (item) => {
        setIdDeudor(item.id_deudor);

        try {
          const response = await axios.post("https://gestioncorrienteserver-production.up.railway.app/api/clients/retrieveDebtCustomer", { idDeudor });
          setDatosDeudor(response.data)

          console.log("Deudas del cliente recuperadas", response.data);
        } catch (error) {
          console.log("Error al recuperar deuda del cliente:", error);
        }
      });
    }
  }

  const [agregandoDeuda, setAgregandoDeuda] = useState(false)
  const agregarDeuda = async (values) => {
    console.log(values)
    setAgregandoDeuda(true)
    try {
      const response = await axios.post("https://gestioncorrienteserver-production.up.railway.app/api/clients/addDebt", {
        values: values,
        nombreCompleto: nombreCompleto
      });
      if (response.status === 201) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Deuda Agregada exitosamente!"
        });
      }

    } catch (error) {
      if (error.response.status === 500) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "Ocurrio un error al intentar añadir la deuda"
        });
      }
    } finally {
      setTimeout(() => {
        setAgregandoDeuda(false)
        mostrarPagosTotales()
        
        getRegistersPays()
      }, 500);
    }
  }
  const [updatingDebt, setUpdatingDebt] = useState(false)
  const updateDebtCustomer = async (formData) => {
    setUpdatingDebt(true);

    try {
      let entrega = 0;

      // Convertir formData.get('id') a número entero en base 10
      const productId = parseInt(formData.get('id'), 10);
      const ultimo_estado_entrega = parseInt(formData.get('nuevoValor') || 0);

      // Buscar el producto por su ID
      const producto = datosDeudor.find(producto => producto.id === productId);

      if (producto) {
        const montoUltimaEntrega = parseInt(producto.monto_entrega || 0);
        console.log("Datos del producto a actualizar: ", producto)
        const nuevoValor = parseInt(formData.get('nuevoValor'), 10);

        entrega = montoUltimaEntrega + nuevoValor;

        console.log("nuevo valor", nuevoValor);
        console.log("entrega", entrega);

       await axios.put('https://gestioncorrienteserver-production.up.railway.app/api/debts/updateDebtCustomer', {
          fechaEntrega: formData.get('fechaEntrega'),
          id: formData.get('id'),
          nuevoValor: entrega,
          ultimaEntrega: ultimo_estado_entrega,
          id_deudor: idDeudor
        });

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
          title: "Deuda actualizada exitosamente!"
        });
        traerDatosDeudor()
        setTimeout(() => {
          mostrarPagosTotales()
        }, 1000);
      } else {
        console.log(`No se encontró ningún producto con ID ${formData.get('id')}`);
      }
    } catch (error) {
      console.log("Error al actualizar deuda:", error);
    } finally {
      setUpdatingDebt(false); // Aseguramos cambiar el estado de updatingDebt al finalizar
    }
  };

  const [allDebts, setAllDebts] = useState(null)
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("https://gestioncorrienteserver-production.up.railway.app/api/clients/getAllDebts");
        setAllDebts(response.data);
      } catch (error) {
        console.error("Error al obtener todas las deudas:", error);
      }
    })();
  }, [])

  const [debtActivate, setDebtActivate] = useState(null);
  const [buttonCount, setButtonCount] = useState(0);
  const activateAddDebt = () => {
    setDebtActivate(true);
    setButtonCount(buttonCount + 1);
    if (buttonCount >= 1) {
      setDebtActivate(false);
      setButtonCount(0);
    }

  }

  const deleteIndividualDebt = async (id) => {
    try {
      await axios.delete("https://gestioncorrienteserver-production.up.railway.app/api/clients/deleteIndividualDebt", { data: { idDelete: id } });
      traerDatosDeudor();
      setTimeout(() => {
        mostrarPagosTotales()
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };
  function getDate() {
    const date = new Date();
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let fullDate = `${day}-${month}-${year}`
    return fullDate
  }

  const cancelarFichero = async (itemsToSave) => {
    const cliente = datosDelCliente && datosDelCliente[0];
    const formData = new FormData()
    formData.append('id', cliente.id);
    formData.append('nombre', cliente.nombre);
    formData.append('apellido', cliente.apellido);
    formData.append('dni', cliente.dni);
    formData.append('id_deudor', cliente.id_deudor);
    formData.append('fecha_cancelacion', getDate());

    itemsToSave.forEach((item, index) => {
      formData.append(`productos[${index}][id]`, item.id);
      formData.append(`productos[${index}][nombre_producto]`, item.nombre_producto);
      formData.append(`productos[${index}][precio_unitario]`, item.precio_unitario);
      formData.append(`productos[${index}][cantidad]`, item.cantidad);
      formData.append(`productos[${index}][fecha_compra]`, item.fecha);
      formData.append(`productos[${index}][id_usuario]`, item.id_usuario);
      formData.append(`productos[${index}][nombre_completo]`, item.nombre_completo);
      formData.append(`productos[${index}][moneda]`, item.moneda);

    });

    for (let pair of formData) {
      console.log("Datos del fichero: ", pair[0], ":", pair[1])
    }
    try {
      await axios.post("https://gestioncorrienteserver-production.up.railway.app/api/clients/cancelarFichero", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

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
        title: "Fichero cancelado exitosamente!"
      });
      traerDatosDeudor()
      setTimeout(() => {
        mostrarPagosTotales()
      }, 1000);

    } catch (error) {
      console.log(error)

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Ocurrio un error inesperado, intente de nuevo!"
      });
    }
  }

  const insertTotalPay = async (formDataEntrega) => {
    for (var pair of formDataEntrega) {
      console.log("Recibiendo en la funcion (insertTotalPay):", pair[0] + ":" + pair[1])
    }
    try {
      const response = await axios.post("https://gestioncorrienteserver-production.up.railway.app/api/clients/insertTotalPays",
        {
          data:
          {
            id_usuario: formDataEntrega.get("id_cliente_deudor"),
            monto_entrega: formDataEntrega.get("monto_entrega"),
            fecha_entrega: formDataEntrega.get("fecha_entrega")
          }
        });
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }
  const [pagosTotalesData, setPagosTotalesData] = useState(null);

  useEffect(() => {
    let timeout;
    if (idDeudor) {
      timeout = setTimeout(async () => {
        try {
          const response = await axios.get("https://gestioncorrienteserver-production.up.railway.app/api/clients/getTotalPays", {
            params: { id_deudor: idDeudor }
          });
          setPagosTotalesData(response.data);
        } catch (error) {
          console.log(error);
        }
      }, 1000); // Espera 1 segundo antes de ejecutar la llamada
    }

    return () => clearTimeout(timeout); // Limpiar el timeout si idDeudor cambia antes de ejecutarse

  }, [idDeudor, datosDelCliente]);

  const mostrarPagosTotales = async () => {
    try {
      const response = await axios.get("https://gestioncorrienteserver-production.up.railway.app/api/clients/getTotalPays", {
        params: { id_deudor: idDeudor }
      });
      setPagosTotalesData(response.data);
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
        title: "Datos actualizados"
      });
    } catch (error) {
    }
  }
  //obtener el registro de entregas totales
  const [getRegisterPaysData, setGetRegisterPaysData] = useState(null)
  useEffect(() => {
    let timeout;
    if (idDeudor) {
      timeout = setTimeout(async () => {
        try {
          const response = await axios.get("https://gestioncorrienteserver-production.up.railway.app/api/clients/getRegisterPays", {
            params: { id_deudor: idDeudor }
          });
          setGetRegisterPaysData(response.data);
        } catch (error) {
        }
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [idDeudor, datosDelCliente])
  async function getRegistersPays() {
    try {
      const response = await axios.get("https://gestioncorrienteserver-production.up.railway.app/api/clients/getRegisterPays", {
        params: { id_deudor: idDeudor }
      });
      setGetRegisterPaysData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const editClientData = (values) => {

  }
  const [debtHistory, setDebtHistory] = useState([])
  const obtenerHistorial = async (data) => {
    console.log(data)
    try {
      const response = await axios.post("https://gestioncorrienteserver-production.up.railway.app/api/clients/obtenerHistorialDelCliente", data)
      setDebtHistory(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
      if (error.response.status === 404) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: `${error.response.data.error}`
        });
      }
      if (error.response.status === 500) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: `${error.response.data.error}`
        });
      }
    }
  }

  const [loggingIn, setLoggingIn] = useState(false);
  const [AuthData, setAuthData] = useState(null)
  const login = async (dataValues) => {
    setLoggingIn(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: dataValues.email,
        password: dataValues.password,
      })
      if (error) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "Hubo un error, intente nuevamente"
        });
      }
      if (data.user !== null || data.session !== null) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: `Bienvenido/a a Gestion Corriente`
        });
        setAuthData(data.user)
        navigate("/debtHistory")
      }else{
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: `Credenciales Inválidas`
        });
      }
      if (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoggingIn(false)
    }
  }
  const closeSession = async () => {
    setLoggingIn(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: `Error al cerrar sesión, intentelo de nuevo`
        });
      }else{
        navigate("/login")
      }
    } catch (error) {
      console.log(error)
    }finally{
      setLoggingIn(false)

    }
  }
  return (
    <AppContext.Provider value={{
      createUser,
      creandoUsuario,
      findUser,
      buscandoUsuario,
      datosDelCliente,
      idDeudor,
      datosDeudor,
      agregarDeuda,
      agregandoDeuda,
      allDebts,
      updateDebtCustomer, insertTotalPay,
      updatingDebt,
      traerDatosDeudor,
      activateAddDebt, debtActivate
      , deleteIndividualDebt, cancelarFichero
      , pagosTotalesData, mostrarPagosTotales,
      getRegistersPays, getRegisterPaysData,
      editClientData
      , debtHistory, obtenerHistorial,
      login, loggingIn, closeSession, AuthData


    }}>
      {children}
    </AppContext.Provider>
  );
};
