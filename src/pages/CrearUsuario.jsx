import React, { useState, useEffect } from 'react'
import { useAppContext } from '../componentes/context';
import { IoPerson } from "react-icons/io5";
import { MdPermIdentity, MdAttachEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { TbRouteSquare } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";
import Swal from 'sweetalert2';
import { supabase } from '../Auth/supabase';
import "./css/crearUsuario.css"
import { useNavigate } from 'react-router-dom';
function CrearUsuario() {
  const navigate = useNavigate()
  useEffect(()=>{
    (async ()=>{
        const { data, error } = await supabase.auth.getSession()
        if (!data.session) {
            navigate('/login')
        }
    })()
},[])
  const {createUser, creandoUsuario} = useAppContext()
  const [values, setValues] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email:"",
    telefono: '',
    direccion: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const [isFormOk, setIsFormOk] = useState(false)
  const validateForm = () =>{
    if (values.dni === "" || values.nombre === "" || values.apellido === "" || values.telefono === "" || values.email === "") {
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
        title: "Algunos campos estan vacíos"
      });
    }else{
      setIsFormOk(true)
    }
  }
  const sendData = (event) =>{
    event.preventDefault()
    validateForm()
    if (isFormOk) {
      createUser(values)
    }
  }
  return (
    <div className='wrapper__form-registerUser'>
      <h1 className='registerUser__h1'>Registrar Cliente</h1>
      <form className='registerUser__form'>
        <label htmlFor="nombre" className='registerUser__label'>
          <IoPerson/> Nombre:
          <input type="text" name="nombre" id="nombre" value={values.nombre} onChange={handleChange} className='registerUser__input'/>
        </label>

        <label htmlFor="apellido" className='registerUser__label'> 
          <MdPermIdentity/> Apellido:
          <input type="text" name="apellido" id="apellido" value={values.apellido} onChange={handleChange} className='registerUser__input'/>
        </label>

        <label htmlFor="dni" className='registerUser__label'>
          <FaRegAddressCard/> DNI:
          <input type="number" name="dni" id="dni" value={values.dni} onChange={handleChange} className='registerUser__input'/>
        </label>

        <label htmlFor="email" className='registerUser__label'>
          <MdAttachEmail/> email:
          <input type="text" name="email" id="email" value={values.email} onChange={handleChange} className='registerUser__input'/>
        </label>

        <label htmlFor="Telefono" className='registerUser__label'>
          <FaPhoneAlt/> Teléfono:
          <input type="number" name="telefono" id="telefono" value={values.telefono} onChange={handleChange} className='registerUser__input'/>
        </label>

        <label htmlFor="direccion" className='registerUser__label'>
          <TbRouteSquare/> Dirección:
          <input type="text" name="direccion" id="direccion" value={values.direccion} onChange={handleChange} className='registerUser__input'/>
        </label>
        <button onClick={sendData} className='registerUser__button' disabled={creandoUsuario} style={{backgroundColor: creandoUsuario ? "grey" : ""}} >{creandoUsuario ? "Aguarde..." : "Crear Usuario"}</button>
      </form>
    </div>
  )
}

export default CrearUsuario