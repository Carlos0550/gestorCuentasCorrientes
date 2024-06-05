import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import { useAppContext } from '../context';
function PagosTotales({ mostrarModalEntregasTotales, entregasTotalesData, saldoTotal }) {
    const { insertTotalPay, mostrarPagosTotales, getRegistersPays } = useAppContext()
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
        } else if(value > saldoTotal){
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
        if (!isNaN(value) && (entregasTotalesData) && (value !== undefined || value !== null)) {
            var formDataEntregas = new FormData()
            var date = new Date();

            {
                entregasTotalesData && entregasTotalesData.map((item) => {
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
                    
                    insertTotalPay(formDataEntregas)
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



    const showPayData = () => {
        
        const item = entregasTotalesData && entregasTotalesData[0]; // Acceder al primer elemento
        console.log(entregasTotalesData)
        console.log("Saldo total: ", saldoTotal)
        return (
          <>
            {item && (
              <div>
                <Modal.Title>Datos del cliente</Modal.Title>
                <div>
                  <strong>Nombre: {item.nombre_completo}</strong>
                </div>
                <div>
                  <strong>Saldo: ${saldoTotal}</strong>
                </div>
                <Modal.Title>Ingrese el monto de la entrega:</Modal.Title>
                <div>
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
            <Modal show={mostrarModalEntregasTotales}>
                <Modal.Header closeButton onClick={mostrarModalEntregasTotales}>
                    <Modal.Title>Hacer una entrega total</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showPayData()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={mostrarModalEntregasTotales}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PagosTotales;
