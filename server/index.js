const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

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
                const insertUserQuery = `INSERT INTO usuarios (nombre, apellido, email, dni, telefono, direccion, deudor, id_deudor) VALUES ('${nombre}', '${apellido}', '${email}', '${dni}', '${telefono}', '${direccion}', 'No', '${idDeudor}')`;

                db.query(insertUserQuery, (err, result) => {
                    if (err) {
                        console.error('Error al insertar el usuario', err);
                        res.status(500).send('Error al insertar el usuario');
                        return;
                    }

                    const insertAdeudamientoQuery = `INSERT INTO adeudamiento (id_usuario) VALUES ('${idDeudor}')`;

                    db.query(insertAdeudamientoQuery, (errAdeudamiento, resultAdeudamiento) => {
                        if (errAdeudamiento) {
                            console.error('Error al insertar en adeudamientos:', errAdeudamiento);
                            res.status(500).send('Error al insertar en adeudamientos');
                            return;
                        }

                        res.status(201).send('Usuario creado exitosamente');
                    });
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

app.post("/api/clients/retrieveDebtCustomer", (req, res)=>{
    const {idDeudor} = req.body
    
    const query = `SELECT * FROM adeudamiento WHERE id_usuario = ${idDeudor}`
    db.query(query, (err, result)=>{
        if (result === null || result=== undefined) {
            return res.status(404).send("El usuario no tiene deudas")
        }
        if (err) {
            res.status(500).send("Ocurrio un error Buscando las deudas del usuario")
            console.log(err)
            return;
        }
        if(result.length === 0){
            res.status(400).send("No se han encontrado deudas")
            return;
        }

        res.status(200).json(result)
    })
})

app.listen(process.env.PORT || port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
