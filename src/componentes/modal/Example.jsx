import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import { useAppContext } from '../context';
function Example({ show, payData }) {
  const { updateDebtCustomer, updatingDebt } = useAppContext()
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
    } else {
      confirmChanges(e)
    }
  }

  const confirmChanges = (e) => {
    e.preventDefault();
    // Asegúrate de que value esté definido y sea válido
    if (!isNaN(value) && payData && payData.id && value !== undefined) {
      var formData = new FormData();
      var date = new Date();
      formData.append("fechaEntrega", date.toISOString().split('T')[0]);
      formData.append("id", payData.id);
      formData.append("nuevoValor", value);

      Swal.fire({
        title: "Guardar Cambios?",
        showDenyButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: `Cancelar`
      }).then((result) => {
        if (result.isConfirmed) {
          // Lógica de confirmación de cambios
          updateDebtCustomer(formData);
        } else if (result.isDenied) {
          // Manejo de cancelación
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
    return (
      <>
        <div>
          <strong>ID del Producto</strong> {payData.id}
        </div>
        <div>
          <strong>Nombre del Producto:</strong> {payData.nombre_producto}
        </div>
        <div>
          <strong>Precio unitario:</strong> ${payData.precio_unitario} {payData.moneda}
        </div>
        {payData.moneda === "USD" ?
          <div>
            <strong>Conversion: ${payData.precio_unitario * 1200}</strong>
          </div>
          : ""}
        <div>
          <strong>Cantidad:</strong> {payData.cantidad}
        </div>
        <div>
          <strong>Fecha de compra:</strong> {payData.fecha}
        </div>
        {payData.monto_entrega ?
          <div>
            <strong>Monto Entregado:</strong> ${payData.monto_entrega}</div>
          : ""}
        {payData.moneda === "USD" ?
          <div>
            <strong>Saldo restante: ${(payData.precio_unitario * 1200) - payData.monto_entrega}</strong>
          </div>
          : <strong>Saldo restante: ${payData.precio_unitario - payData.monto_entrega}</strong>}
        <div>
          <input type="text" value={value} onChange={handleInput} style={{ width: "50%" }} className='findUser__input' />
        </div>
        <div >
          <button onClick={validateForm} style={{ marginTop: ".5em" }} className='addDebt__button'>Guardar Entrega</button>
        </div>
      </>
    );
  };


  return (
    <>
      <Modal show={show}>
        <Modal.Header closeButton onClick={show}>
          <Modal.Title>Detalles del producto a realizar entrega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showPayData()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={show}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Example;
