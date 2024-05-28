import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const AppContext = createContext();

export const useAppContext = () => {
    const ctx = useContext(AppContext);
    if (!ctx) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return ctx;
};

export const AppContextProvider = ({ children }) => {
  const [creandoUsuario, setCreandoUsuario] = useState(false)
  const [datosDelCliente, setDatosDelCliente] = useState(null)
    const createUser = async (values) => {
      setCreandoUsuario(true)
            try {
              const response = await axios.post("http://localhost:3001/api/clients/create", values);
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
            }else{
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
          }finally{
            setTimeout(() => {
              setCreandoUsuario(false)
            }, 500);
          }
    };
    const [idDeudor, setIdDeudor] = useState(null)
    const[buscandoUsuario, setBuscandoUsuario] = useState(false)
    const findUser = async(values) =>{
      setBuscandoUsuario(true)
      try {
        const response = await axios.post("http://localhost:3001/api/clients/find", values)
        setDatosDelCliente(response.data)
        console.log(response.data)
        
        if(response.status === 201){
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
    }catch (error) {
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
        }else if(error.response.status === 404){
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
        }else if(error.response.status === 201){
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
        }else if(error.response.status === 400){
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
        }else{
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
            title: "Unknow: Error desconocido"
          });
        }
      }finally{
        setTimeout(() => {
          setBuscandoUsuario(false)
        }, 500);
      }
    }
    const [datosDeudor, setDatosDeudor] = useState(null)
    useEffect(() => {
      if (datosDelCliente && datosDelCliente.length > 0) {
          datosDelCliente.forEach(async (item) => {
              setIdDeudor(item.id_deudor);

              try {
                  const response = await axios.post("http://localhost:3001/api/clients/retrieveDebtCustomer", { idDeudor });
                  console.log(response.data);
                  setDatosDeudor(response.data)
              } catch (error) {
                  console.log("Error al recuperar deuda del cliente:", error);
              }
          });
      }
  }, [datosDelCliente]);
    return (
        <AppContext.Provider value={{ createUser,
          creandoUsuario,
          findUser,
          buscandoUsuario,
          datosDelCliente,
          idDeudor,
          datosDeudor
         }}>
            {children}
        </AppContext.Provider>
    );
};
