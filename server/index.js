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

// app.put("/api/debts/updateDebtCustomer", (req, res) => {
//   const formData = req.body;
//   const { id, fechaEntrega, nuevoValor, ultimaEntrega } = formData;

//   // Iniciar una transacción
//   db.beginTransaction((err) => {
//       if (err) {
//           console.error('Error al iniciar transacción:', err);
//           return res.status(500).json({ error: 'Error interno del servidor' });
//       }

//       try {
//           const updateQuery = `UPDATE adeudamiento 
//                                SET dia_entrega = ?, monto_entrega = ?, ultimo_estado_entrega = ? 
//                                WHERE id = ?`;

//           db.query(updateQuery, [fechaEntrega, nuevoValor, ultimaEntrega, id], (err, result) => {
//               if (err) {
//                   console.error("Error al ejecutar consulta de actualización en adeudamiento:", err);
//                   return db.rollback(() => {
//                       res.status(500).json({ error: "Error interno del servidor" });
//                   });
//               }

//               // Commit la transacción si la actualización fue exitosa
//               db.commit((err) => {
//                   if (err) {
//                       console.error("Error al hacer commit de la transacción:", err);
//                       return db.rollback(() => {
//                           res.status(500).json({ error: "Error interno del servidor" });
//                       });
//                   }
//                   res.json({ message: "Actualización exitosa" });
//               });
//           });
//       } catch (error) {
//           console.error('Error al ejecutar transacción:', error);
//           db.rollback(() => {
//               res.status(500).json({ error: 'Error interno del servidor' });
//           });
//       }
//   });
// });


app.delete("/api/clients/deleteIndividualDebt", (req, res) => {
    const { idDelete } = req.body;
    if (!idDelete) {
        res.status(400).json({ error: 'Debe proporcionar un ID de usuario' });
    }

    const query = `DELETE FROM adeudamiento WHERE id = '${idDelete}'`;
    db.query(query, (err,result)=>{
        if (err) {
            console.error("Error al ejecutar consulta de eliminación:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
        res.status(200).json({ message: 'Deuda eliminada correctamente' });
    })
  });
  
app.delete("/api/clients/cancelarFichero", (req, res) => {
    const { idDeudor } = req.body;
  
    db.beginTransaction(err => {
      if (err) {
        console.error("Error al iniciar la transacción:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }
  
      const deleteQueryAdeudamientos = `DELETE FROM adeudamiento WHERE id_usuario = '${idDeudor}'`;
      const deleteQueryEntregas = `DELETE FROM entregas WHERE id_cliente_deudor = '${idDeudor}'`;
      const deleteQueryListaDeEntregas = `DELETE FROM lista_de_entregas WHERE id_deudor = '${idDeudor}'`;
        db.query(deleteQueryAdeudamientos, (err, result) => {
          if (err) {
            console.error("Error al ejecutar la consulta DELETE adeudamientos:", err);
            return db.rollback(() => {
              res.status(500).json({ error: "Error interno del servidor" });
            });
          }
  
        db.query(deleteQueryEntregas, (err, result) => {
          if (err) {
            console.error("Error al ejecutar la consulta DELETE entregas:", err);
            return db.rollback(() => {
              res.status(500).json({ error: "Error interno del servidor" });
            });
          }
        db.query(deleteQueryListaDeEntregas, (err, result) => {
          if (err) {
            console.error("Error al ejecutar la consulta DELETE listaD_de_EMTREGAS:", err);
            return db.rollback(() => {
              res.status(500).json({ error: "Error interno del servidor" });
            });
          }
        })
  
          db.commit(err => {
            if (err) {
              console.error("Error al hacer commit de la transacción:", err);
              return db.rollback(() => {
                res.status(500).json({ error: "Error interno del servidor" });
              });
            }
            res.status(200).json({ message: 'Fichero cancelado correctamente' });
          });
        });
      });
    });
});

app.post('/api/clients/insertTotalPays', (req, res) => {
  const { id_usuario, monto_entrega, fecha_entrega } = req.body.data;

  // Iniciar una transacción
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error al iniciar transacción:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    const checkQuery = `SELECT COUNT(*) AS count FROM entregas WHERE id_cliente_deudor = '${id_usuario}'`;

    db.query(checkQuery, (err, result) => {
      if (err) {
        console.error('Error al contar registros:', err);
        return db.rollback(() => {
          res.status(500).json({ error: 'Error interno del servidor' });
        });
      }

      const count = result[0].count;

      if (count === 0) {
        // Si no hay registros, insertar uno nuevo en entregas
        const insertQuery = `INSERT INTO entregas (monto_entrega, fecha_entrega, id_cliente_deudor) VALUES ('${monto_entrega}', '${fecha_entrega}', '${id_usuario}')`;

        db.query(insertQuery, (err, result) => {
          if (err) {
            console.error('Error al insertar nuevos datos en entregas:', err);
            return db.rollback(() => {
              res.status(400).json({ error: 'Error al insertar datos en entregas' });
            });
          }

          // Aquí puedes realizar la inserción en la otra tabla
          const listaDeIntregasInsertQuery = `INSERT INTO lista_de_entregas (id_deudor, monto_entrega, fecha_entrega) VALUES ('${id_usuario}', '${monto_entrega}', '${fecha_entrega}')`;

          db.query(listaDeIntregasInsertQuery, (err, result) => {
            if (err) {
              console.error('Error al insertar datos en otra_tabla:', err);
              return db.rollback(() => {
                res.status(400).json({ error: 'Error al insertar datos en otra_tabla' });
              });
            }

            // Commit de la transacción si todo fue exitoso
            db.commit((err) => {
              if (err) {
                console.error('Error al realizar commit de la transacción:', err);
                return db.rollback(() => {
                  res.status(500).json({ error: 'Error interno del servidor' });
                });
              }
              res.status(200).json({ message: 'Datos insertados correctamente' });
            });
          });
        });
      } else {
        // Si hay registros, obtener el monto existente y sumarlo con el nuevo
        const fetchLastPayData = `SELECT monto_entrega FROM entregas WHERE id_cliente_deudor = '${id_usuario}'`;

        db.query(fetchLastPayData, (err, result) => {
          if (err) {
            console.error('Error al obtener monto existente:', err);
            return db.rollback(() => {
              res.status(500).json({ error: 'Error interno del servidor' });
            });
          }

          const montoExistente = result[0].monto_entrega || 0; // por si no existen datos
          const nuevoMonto = parseFloat(montoExistente) + parseFloat(monto_entrega);

          // Actualizar el monto de entrega con el nuevo valor
          const updateQuery = `UPDATE entregas SET monto_entrega = '${nuevoMonto}', fecha_entrega = '${fecha_entrega}' WHERE id_cliente_deudor = '${id_usuario}'`;

          db.query(updateQuery, (err, result) => {
            if (err) {
              console.error('Error al actualizar datos existentes:', err);
              return db.rollback(() => {
                res.status(400).json({ error: 'Error al actualizar datos' });
              });
            }

            // Aquí puedes realizar la inserción en la otra tabla
            const insertRegisterQuery = `INSERT INTO lista_de_entregas (monto_entrega, fecha_entrega, id_deudor) VALUES ('${monto_entrega}', '${fecha_entrega}', '${id_usuario}')`;

            db.query(insertRegisterQuery, (err, result) => {
              if (err) {
                console.error('Error al insertar datos en otra_tabla:', err);
                return db.rollback(() => {
                  res.status(400).json({ error: 'Error al insertar datos en otra_tabla' });
                });
              }

              // Commit de la transacción si todo fue exitoso
              db.commit((err) => {
                if (err) {
                  console.error('Error al realizar commit de la transacción:', err);
                  return db.rollback(() => {
                    res.status(500).json({ error: 'Error interno del servidor' });
                  });
                }
                res.status(200).json({ message: 'Datos actualizados correctamente' });
              });
            });
          });
        });
      }
    });
  });
});



  app.get("/api/clients/getTotalPays", (req, res) => {
    const { id_deudor } = req.query;
  
    if (id_deudor !== undefined && id_deudor !== null) {
      const query = `SELECT * FROM entregas WHERE id_cliente_deudor = '${id_deudor}'`;
  
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error en la consulta SQL:', err);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }
        console.log("Datos obtenidos")
        res.status(200).json(results);
      });
    } else {
      console.log("No se proporcionó un ID de deudor");
      res.status(400).json({ error: 'No se proporcionó un ID de deudor válido' });
    }
  });
  
app.get("/api/clients/getRegisterPays", (req,res)=>{
    const {id_deudor} = req.query
    const query = `SELECT * FROM lista_de_entregas WHERE id_deudor = '${id_deudor}'`;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        console.log("Datos obtenidos")
        res.status(200).json(result);
    });
})
app.listen(process.env.PORT || port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
