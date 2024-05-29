import React, { useState } from 'react';
import "./debt.css";
import { useAppContext } from '../context';

function AddDebt() {
    const getDate = () => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const { idDeudor, agregarDeuda, agregandoDeuda } = useAppContext();
    const [products, setProducts] = useState([]);
    const [values, setValues] = useState({
        nameProduct: "",
        price: "",
        arsOrUsd: "ARS",
        quantity: "",
        date: getDate(),
        id_deudor: idDeudor
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const editProduct = (index) =>{
        //accedemos al producto del array products en el indice especificado, y guardamos ese producto en la variable
        const productToEdit = products[index];
        setValues({
            nameProduct: productToEdit.nameProduct,
            price: productToEdit.price,
            arsOrUsd: productToEdit.arsOrUsd,
            quantity: productToEdit.quantity,
            description: productToEdit.description,
            date: productToEdit.date,
            id_deudor: idDeudor
        })
        //luego de editarlo en el formulario, usamos filter para crear un nuevo array exluyendo el producto editado

        const updatedProduct = products.filter((_,idx) => idx !== index);
        //por ultimo, actualizamos el array de productos
        setProducts(updatedProduct);
    }

    const deleteProduct = (index) => {
        const updatedProducts = products.filter((_,idx)=> idx !== index)
        setProducts(updatedProducts)
    }

    const handleSaveProduct = () => {
        setProducts(prevProducts => [...prevProducts, values]);
        setValues({
            nameProduct: "",
            price: "",
            arsOrUsd: "ARS",
            quantity: "",
            description: "",
            date: getDate(),
            id_deudor: idDeudor
        });
    };

    const verifyArray = () =>{
        if(products.length === 0){
            return false
        }else{
            return true
        }
    }
    const sendProducts = () =>{
        products.map((product)=>{
            console.log(product)
        })
        if(verifyArray()){
            agregarDeuda(products)
        }else{
            alert("No hay productos agregados")
        }
    }

    return (
        <>
            <form className='add__producto-form'>
                <label htmlFor="nameProduct" className='add__producto-label'>Nombre del producto:
                    <input type="text" name="nameProduct" value={values.nameProduct} onChange={handleChange} className='add__producto-input' />
                </label>
                <label htmlFor="price" className='add__producto-label'>
                    Precio Unitario:
                    <input type="text" name="price" value={values.price} onChange={handleChange} placeholder='Ingrese solo el valor ' className='add__producto-input' />
                </label>
                <label htmlFor="arsOrUsd" className='add__producto-label'>Moneda:
                    <select name="arsOrUsd" value={values.arsOrUsd} onChange={handleChange} className='add__producto-input'>
                        <option value="ARS">ARS</option>
                        <option value="USD">USD</option>
                    </select>
                </label>

                <label htmlFor="quantity" className='add__producto-label'>Cantidad:
                    <input type="number" name="quantity" value={values.quantity} onChange={handleChange} className='add__producto-input' />
                </label>
                <div className='buttons'>
                    <button type="button" className='btn__saveProduct' onClick={handleSaveProduct}>Guardar Producto</button>
                </div>
            </form>

            {/* Visualización de los productos agregados */}
            <div className="productos-agregados">
                <h3>Productos Agregados:</h3>
                {products.map((product, index) => (
                    <div key={index} className="producto">
                        <p>Producto N° {index+1}</p>
                        <p><strong>Nombre:</strong> {product.nameProduct}</p>
                        <p><strong>Precio:</strong> {product.price} {product.arsOrUsd}</p>
                        <p><strong>Cantidad:</strong> {product.quantity}</p>
                        <button onClick={()=>editProduct(index)}>Editar</button>
                        <button onClick={()=>deleteProduct(index)}>Eliminar</button>
                        <hr />
                    </div>
                ))}
                <button disabled={agregandoDeuda} onClick={sendProducts}>{agregandoDeuda ? "Guardando":"Guardar Factura"}</button>
            </div>
        </>
    );
}

export default AddDebt;
