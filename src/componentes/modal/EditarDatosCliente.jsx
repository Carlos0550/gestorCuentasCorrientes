import 'bootstrap/dist/css/bootstrap.min.css';
import {  useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import { useAppContext } from '../context';
function EditarDatosCliente({ mostrarModal }) {
    const { datosDelCliente, mostrarPagosTotales, getRegistersPays, mostrarModalEntregasTotales,
        isEditing, //loader
        editClientData //function

     } = useAppContext()
    const [values, setValues] = useState({
        nombre_completo: "",
        apellido: "",
        correo: "",
        dni: "",
        direccion: "",
        telefono: ""
    })
    const handleInput = (e) => {
        const {value, name} = e.target
        setValues((prevState)=>({
            ...prevState,
            [name]: value
        }))
    }
    const validateForm = (e) => {
        if (values.apellido === "" || values.nombre_completo === "" || values.direccion === "" || values.correo === "" || values.dni === "" || values.telefono === "") {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                customClass:{
                    popup: 'my-toast'
                },
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                title: "Hay algunos campos vacios"
            });
            return
        }else{
            confirmChanges(e)
        }
    }

    const confirmChanges = (e) => {
        e.preventDefault();
        
        Swal.fire({
            title: "Guardar Cambios?",
            showDenyButton: true,
            confirmButtonText: "Guardar",
            denyButtonText: `Cancelar`
        }).then((result) => {
            if (result.isConfirmed) {
                //envio de datos
                editClientData(values)
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
    };



    const showEditData = () => {
        
        const item = datosDelCliente && datosDelCliente[0]; 
        return (
          <>
            {item && (
              <div>
                <Modal.Title style={{fontSize: "3em"}}>Editando datos de: {item.nombre} {item.apellido}</Modal.Title>
                <p style={{color: "red", fontSize: "2em"}}>Todos los campos son obligatorios</p>
                <div style={{fontSize: "3em"}}>
                    Nombre completo
                  <input type="text" value={values.nombre_completo} name='nombre_completo' onChange={handleInput} style={{ width: "50%" }} className='findUser__input' />
                </div>
                <div style={{fontSize: "3em"}}>
                    Apellido
                  <input type="text" value={values.apellido} name='apellido' onChange={handleInput} style={{ width: "50%" }} className='findUser__input' />
                </div>
                <div style={{fontSize: "3em"}}>
                    Correo electronico
                  <input type="text" value={values.correo} name='correo' onChange={handleInput} style={{ width: "50%" }} className='findUser__input' />
                </div>
                <div style={{fontSize: "3em"}}>
                    DNI
                  <input type="text" value={values.dni} name='dni' onChange={handleInput} style={{ width: "50%" }} className='findUser__input' />
                </div>
                <div style={{fontSize: "3em"}}>
                    Dirección
                  <input type="text" value={values.direccion} name='direccion' onChange={handleInput} style={{ width: "50%" }} className='findUser__input' />
                </div>
                <div style={{fontSize: "3em"}}>
                    Telefono
                  <input type="text" value={values.telefono} name='telefono' onChange={handleInput} style={{ width: "50%" }} className='findUser__input' />
                </div>
                <div>
                  <button onClick={validateForm} style={{ marginTop: ".5em" }} className='addDebt__button'>Actualizar datos</button>
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
                    {/* nothing */}
                </Modal.Header>
                <Modal.Body>
                    {showEditData()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={mostrarModal} style={{fontSize: "3em"}}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditarDatosCliente;
