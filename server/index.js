const express = require('express');
const cors = require('cors');
const db = require('./db');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json()); //para apps json
app.use(bodyParser.urlencoded({ extended: true })); //para formularios HTML

const port = 3001;

app.get("/", (req, res) => {
    res.send("hello")
});

function randomID(){
    return Math.random().toString(14).substr(2,9)
}
app.post("/api/clients/create", (req, res) => {
    const { nombre, apellido, email, dni, telefono, direccion } = req.body;
    const idDeudor = randomID(); 

    const checkUserQuery = `SELECT COUNT(*) AS count FROM usuarios WHERE dni = '${dni}'`;

    try {
        db.query(checkUserQuery, (error, results) => {
            if (error) {
                console.error("Error al verificar el usuario", error);
                res.status(501).send('Error al verificar el usuario');
                return;
            }

            const count = results[0].count;
            if (count > 0) {
                res.status(409).send('Error, ya existe un usuario con ese DNI!');
            } else {
                const insertUserQuery = `INSERT INTO usuarios (nombre, apellido, email, dni, telefono, direccion, id_deudor) VALUES ('${nombre}', '${apellido}', '${email}', '${dni}', '${telefono}', '${direccion}','${idDeudor}')`;

                db.query(insertUserQuery, (err, result) => {
                    if (err) {
                        console.error('Error al insertar el usuario', err);
                        res.status(500).send('Error al insertar el usuario');
                        return;
                    }

                    res.status(201).send('Usuario creado correctamente');
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
});



app.post("/api/clients/find", (req, res) => {
    const { nombre, apellido, dni } = req.body;
    let query;

    if (nombre) {
        query = `SELECT * FROM usuarios WHERE nombre = '${nombre}'`;
    } else if (apellido) {
        query = `SELECT * FROM usuarios WHERE apellido = '${apellido}'`;
    } else if (dni) {
        query = `SELECT * FROM usuarios WHERE dni = '${dni}'`;
    } else {
        return res.status(400).send('Debe proporcionar nombre, apellido o dni para la búsqueda.');
    }

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al buscar usuario:", err);
            return res.status(500).send("Error interno del servidor");
        }
        
        if (results.length === 0) {
            return res.status(404).send("No se encontraron usuarios con el criterio proporcionado.");
        }
        res.status(201).json(results); 

    });
});

app.post("/api/clients/retrieveDebtCustomer", (req, res) => {
    const { idDeudor } = req.body;
    console.log(req.body);

    const query = `SELECT * FROM adeudamiento WHERE id_usuario = ?`;
    db.query(query, idDeudor, (err, result) => {
        if (err) {
            console.error("Error al ejecutar la consulta:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        if (result.length === 0) {
            console.log("No se encontraron resultados para idDeudor:", idDeudor);
            return res.status(200).json([]); // Enviar un arreglo vacío si no hay resultados
        }

        console.log("Resultados encontrados:", result);
        res.status(200).json(result); // Enviar los resultados encontrados
    });
});

app.get("/api/clients/getAllDebts", (req, res)=>{
    const query = `SELECT * FROM adeudamiento`;
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error al ejecutar la consulta:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        if (result.length === 0) {
            console.log("No se encontraron resultados");
            return res.status(200).json([]); 
        }

        console.log("Resultados encontrados:", result);
        res.status(200).json(result); 
    });
})


app.post("/api/clients/addDebt", agregarDeuda);

async function agregarDeuda(req, res) {
    try {
        console.log(req.body);
        const  products  = req.body.values;
        const nombreCompleto = req.body.nombreCompleto

        for (let product of products) {
            const { nameProduct, price, arsOrUsd, quantity, date, id_deudor } = product;
            const query = `INSERT INTO adeudamiento (nombre_producto, precio_unitario, cantidad, fecha, moneda, id_usuario, nombre_completo) VALUES ('${nameProduct}', '${price}', '${quantity}', '${date}', '${arsOrUsd}', '${id_deudor}', '${nombreCompleto}')`;
            await db.query(query);
        }

        res.status(201).json({ message: 'Deudas agregadas correctamente' });
    } catch (error) {
        console.error('Error al agregar deudas:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud' });
    }
}

app.listen(process.env.PORT || port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
