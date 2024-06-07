import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import { useAppContext } from '../context';
function EditarDatosCliente({ mostrarModal }) {
    const { datosDelCliente, mostrarPagosTotales, getRegistersPays, mostrarModalEntregasTotales } = useAppContext()
    const [value, setValue] = useState("")
    const handleInput = (e) => {
        setValue(e.target.value)
    }
    const validateForm = (e) => {
        if (value === "") {
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
                icon: "error",
                title: "Ingresa un valor"
            });
            return
        } else if(""){
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
                icon: "error",
                title: "No puede introducir un valor mayor al saldo restante"
              });
        }else{
            confirmChanges(e)
        }
    }

    const confirmChanges = (e) => {
        e.preventDefault();
        // Asegúrate de que value esté definido y sea válido
        if (!isNaN(value) && (datosDelCliente) && (value !== undefined || value !== null)) {
            var formDataEntregas = new FormData()
            var date = new Date();

            {
                datosDelCliente && datosDelCliente.map((item) => {
                    formDataEntregas.append("monto_entrega", value)
                    formDataEntregas.append("fecha_entrega", date.toISOString().split('T')[0])
                    formDataEntregas.append("id_cliente_deudor", item.id_usuario)
                })
            }


            Swal.fire({
                title: "Guardar Cambios?",
                showDenyButton: true,
                confirmButtonText: "Guardar",
                denyButtonText: `Cancelar`
            }).then((result) => {
                if (result.isConfirmed) {
                    //envio de datos aqui
                    
                    setTimeout(() => {
                        mostrarPagosTotales()
                        getRegistersPays()
                        mostrarModalEntregasTotales()
                    }, 1000);
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
                        title: "Cambios cancelados"
                    });
                }
            });
        } else {
            // Manejo de error si value no es un número válido
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El valor ingresado no es válido. Por favor, ingrese un número.'
            });
        }
    };



    const showEditData = () => {
        
        const item = datosDelCliente && datosDelCliente[0]; 
        console.log(datosDelCliente)
        return (
          <>
            {item && (
              <div>
                <Modal.Title>Editando datos de: {item.nombre} {item.apellido}</Modal.Title>
                <p style={{color: "red"}}>Todos los campos son obligatorios</p>
                <div>
                    Nombre completo
                  <input type="text" value={value} onChange={handleInput} style={{ width: "50%" }} className='findUser__input' />
                </div>
                <div>
                    Apellido
                  <input type="text" value={value} onChange={handleInput} style={{ width: "50%" }} className='findUser__input' />
                </div>
                <div>
                    Correo electronico
                  <input type="text" value={value} onChange={handleInput} style={{ width: "50%" }} className='findUser__input' />
                </div>
                <div>
                    DNI
                  <input type="text" value={value} onChange={handleInput} style={{ width: "50%" }} className='findUser__input' />
                </div>
                <div>
                    Dirección
                  <input type="text" value={value} onChange={handleInput} style={{ width: "50%" }} className='findUser__input' />
                </div>
                <div>
                    Telefono
                  <input type="text" value={value} onChange={handleInput} style={{ width: "50%" }} className='findUser__input' />
                </div>
                <div>
                  <button onClick={validateForm} style={{ marginTop: ".5em" }} className='addDebt__button'>Guardar Entrega</button>
                </div>
              </div>
            )}
          </>
        );
      };
      


    return (
        <>
            <Modal show={mostrarModal}>
                <Modal.Header closeButton onClick={mostrarModal}>
                    <Modal.Title>Editar Datos del cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showEditData()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={mostrarModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditarDatosCliente;
