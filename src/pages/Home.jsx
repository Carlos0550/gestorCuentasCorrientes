import React from 'react'
import { useAppContext } from '../componentes/context'
function Home() {
  const {allDebts} = useAppContext()
  
  const date = new Date()
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  let fullDate = `${day}/${month}/${year}`

  console.log(fullDate)
  return (
    <div>
      <h1>Gestión Corriente</h1>
      <div className='deudas__por-vencer'>
        {allDebts ? allDebts.map((item,index)=>{
          return(
            <div key={index}>
              <p>Cliente: {item.nombre_completo}</p>
              <p>{item.nombre_producto}</p>
              <p>${item.precio_unitario} {item.moneda}</p>
              <p>Cantidad: {item.cantidad}</p>
              <p>Fecha de compra: {item.fecha}</p>
              
            </div>
          )
        }):"No hay deudas"}
      </div>
    </div>
  )
}

export default Home