import React, { useEffect, useState } from 'react'
import "./css/login.css"
import { useAppContext } from '../componentes/context'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
function Login() {
    const {login,loggingIn}= useAppContext()
    const navigate = useNavigate()
    //verificacion de sesion
    useEffect(()=>{
        (async ()=>{
            const { data, error } = await supabase.auth.getSession()
            if (data.session) {
                navigate('/debtHistory')
            }
        })()
    },[])
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const handleInput = (e) =>{
        const {name, value} = e.target
        setValues((prevState)=>({
            ...prevState,
            [name]: value
        }))
    }
    const sendData = (e) => {
        e.preventDefault()
        login(values)
    }
  return (
    <div className='wrapper__form'>
        <form className='login__form' onSubmit={sendData}>
            <label htmlFor="correo" className='label__form'>Correo: 
                <input type="text" name='email' id='email' className='input__form' value={values.email} onChange={handleInput} placeholder='Ingresa tu correo'/>
            </label>
            <label htmlFor="correo" className='label__form'>Contraseña: 
                <input type="password" name='password' id='password' className='input__form' value={values.password} onChange={handleInput} placeholder='Ingresa tu contraseña'/>
            </label>
            <button className='login__button'>{loggingIn ? "Iniciando sesión...": "Iniciar sesión"}</button>
        </form>
    </div>
  )
}

export default Login