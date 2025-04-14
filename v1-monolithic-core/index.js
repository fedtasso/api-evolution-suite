import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

//configuración inicial
const app = express();
const PORT = process.env.PORT || 5000
dotenv.config();

// middleware jason
app.use(express.json());

// Configuración de la base de datos (usando pool directamente)
const pool = mysql.createPool({
  host: 'localhost',
  database: 'v1_data',
  user: 'root',
  password:'',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// configuracion envio de mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASSWORD_MAIL
  }
});

// ------------------------------ registrar usuario ------------------------------
// -------------------------------------------------------------------------------

app.post('/v1/monolithic-core/user', async (req, res) => {
       
    try {
      //obtener conexion
      const connection = await pool.getConnection();
        
      // obtener parametros desde body
      let { firstName, lastName, password, nationalId, passport, email, phoneNumber, address } = req.body;

      // Validación de campos requeridos
      if (!firstName || !lastName || !password || !email) {
        return res.status(400).json({ message: 'firstName, lastName, password y email son requeridos' });
      }

      // dar formato a entradas
      firstName = firstName.toLowerCase().trim()
      lastName = lastName.toLowerCase().trim()
      email = email.toLowerCase().trim()
      address = address.toLowerCase().trim()
  
      // verificar si usuario existe por email
      const [userExists] = await connection.query(`SELECT id FROM users WHERE email = ?  LIMIT 1`, [email] )
      if (userExists.length > 0) {
        return res.status(409).json({message : 'el usuario ya se encuentra registrado'})
      }
  
      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Crear el usuario en tabla users
      const [result] = await connection.query(`INSERT INTO users 
        (firstName, lastName, password, nationalId, passport, email, phoneNumber, address) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [firstName, lastName, hashedPassword, nationalId, passport, email, phoneNumber, address]
    );
      
      try {
            await transporter.sendMail({
                from: process.env.MAIL,
                to: email,
                subject: `Bienvenido ${firstName}`,
                text: `Hola ${firstName} ${lastName}.
                Gracias por registrarte en api-monolithic-core.`
            });
        } catch (mailError) {
            console.error('Error enviando email:', mailError);
        }
      
      // Respuesta exitosa
      return res.status(201).json({
        message: 'Usuario creado exitosamente',
        usuario_id: result.insertId, // Devuelve el ID
      });

    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al crear el usuario' });
    } 
  } )



// ------------------------------ buscar usuario ------------------------------
// -------------------------------------------------------------------------------

app.get('/v1/monolithic-core/users', async (req, res) => {
       
  try {
    //obtener conexion
    const connection = await pool.getConnection();

    // obtener parametros desde url
    let {firstName, lastName} = req.query;

    // variables para buscar usuarios
    let findUserByFirstName;
    let findUserByLastName;

    const [allUsers] = await connection.query(`SELECT id, firstName, lastName, nationalId, passport, email, phoneNumber, address FROM users`);

    // buscar usuario por nombre
    if (firstName){
      firstName = firstName.toLowerCase().trim()
      const [rows] = await connection.query(`SELECT id, firstName, lastName, nationalId, passport, email, phoneNumber, address FROM users WHERE firstName = ?`, firstName);
      if (rows.length < 1) {
        return res.status(404).json({
          message: 'no se ha encontrado ningun usuario con el nombre seleccionado'})
      }else {
        findUserByFirstName = rows
      }
    }

    // buscar usuario por nombre
    if (lastName){
      lastName = lastName.toLowerCase().trim()
      const [rows] = await connection.query(`SELECT id, firstName, lastName, nationalId, passport, email, phoneNumber, address FROM users WHERE lastName = ?`, lastName);
      if (rows.length < 1) {
        return res.status(404).json({
          message: 'no se ha encontrado ningun usuario con el apellido seleccionado'})
      }else {
        console.log(rows)
        findUserByLastName = rows
      }
    }

    // respuesta usuario no encontrado
    if (!findUserByFirstName && !findUserByLastName && !allUsers) {
      return res.status(404).json({
      message: 'no se ha encontrado ningun usuario con la busqueda seleccionada'})
      }

    //respuesta exitosa
    return res.status(201).json({
        message: 'usuario encontrado exitosamente',
        allUsers,
        findUserByFirstName,
        findUserByLastName   
    }); 
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al buscar el usuario' });
  } 
})


// ---------------------------- buscar usuario por ID ----------------------------
// -------------------------------------------------------------------------------

app.get('/v1/monolithic-core/user/:userId', async (req, res) => {
  try {
    //obtener conexion
    const connection = await pool.getConnection();

    // obtener parametros
    const userId = req.params.userId;

    // buscar todos los usuarios
    const [result] = await connection.query(`SELECT id, firstName, lastName, nationalId, passport, email, phoneNumber, address FROM users WHERE id = ?`, userId)

    if (!result) return res.status(404).json({
      message: 'id de usuario no encontrado'})

    //respuesta usuario no encontrado
    if (result.length < 1){
      return res.status(201).json({
        message: 'usuario no encontrado'
      }) 
    }

    //respuesta exitosa
    return res.status(201).json({
        message: 'usuario encontrado exitosamente',
        usuer: result 
    });
    } catch (error) {
      console.log(error)
      res.status(500).json ({error : 'error al buscar el usuario.'})
    }
})


// ------------------------------- borrar usuario por id --------------------------------
// -------------------------------------------------------------------------------
app.delete('/v1/monolithic-core/user/:id', async (req, res) => {
  
  try {
    //obtener conexion
    const connection = await pool.getConnection();

    // obtener parametros
    const userId = req.params.id;

    //borrar usuario
    const [result] = await connection.query('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows < 1) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Respuesta exitosa
    return res.status(201).json({ message: 'usuario borrado con exito'});

  } catch (error) {    
    console.log(error)  
    res.status(500).json({ error: 'Error al borrar el usuario' });
  } 
});


// ------------------------------- actualizar usuario --------------------------------
// -------------------------------------------------------------------------------
app.put('/v1/monolithic-core/user', async (req, res) => {
  
  try {
    //obtener conexion
    const connection = await pool.getConnection();

    //obtener parametros   
    let { userId, firstName, lastName, email, phoneNumber, address } = req.body;
    
    // verificar compos con informacion para validar
    const userDataFront = {}
    if (firstName) {
      firstName = firstName = firstName.toLowerCase().trim();
      userDataFront.firstName = firstName;
    }
    
    if (lastName) {
      lastName = lastName = lastName.toLowerCase().trim()
      userDataFront.lastName = lastName;
    }
    
    if (email) {
      email = email = email.toLowerCase().trim()
      userDataFront.email = email;;
    }
    
    if (phoneNumber) {
      userDataFront.phoneNumber = phoneNumber;
    }
    
    if (address) {
      address = address.toLowerCase().trim()
      userDataFront.address = address;
    }
    
    // verificar que haya informacion a validar
    if (Object.keys(userDataFront).length < 1){
      return res.status(400).json({ error : "No se recibió información para actualizar."})
    };
    
    // buscar informacion del usuario en db     
    const [[userDataDB]] = await connection.query(`SELECT id, firstName, lastName, nationalId, passport, email, phoneNumber, address FROM users WHERE id = ?`, userId)
    
    // varificar si id de usuario existe
    if(userDataDB.length < 1){
      return res.status(404).json({ error: "El id de usuario es incorrecto." });      
    }
    
    // convertir telefono en string para comparar con front  
    userDataDB.phoneNumber = userDataDB.phoneNumber.toString()
    
    //iniciar objeto con informacion a actualizar
    const userUpdate = {}  
    
    // verificar si la informacion es igual a la almacenada en BBDD  
    for (let key in userDataFront){
      if(userDataFront[key] !== userDataDB[key]){
        userUpdate[key] = userDataFront[key]
      }
    }
    
    // Verificar si hay datos para actualizar
    if (Object.keys(userUpdate).length < 1) {
      return res.status(400).json({ error: "No hay información para actualizar." });
    }
    
    // verificar que el mail no pertenezca a otro usuario antes de actualizar 
    if (userUpdate.email) {
      const [[emailExists]] = await connection.query(`SELECT email FROM users WHERE email = ?`, email)
      
      if (emailExists) {
        return res.status(400).json({ message: 'el mail ya se encuentra registrado'});
      }
    }     
    
    // actualizar datos de usuario
    const set_clause = Object.entries(userUpdate)
    .map(([clave, _]) => `${clave} = ?`)
    .join(", ");
    
    const params = Object.values(userUpdate);
    params.push(userId);  // Añade el ID al final para la cláusula WHERE
    
    const query = `UPDATE users
    SET ${set_clause}
    WHERE id = ?`;
    
    const [result] = await connection.query(query, params);

    if (result.affectedRows < 1) {
      return res.status(400).json({error: 'error al actualizar el usuario'})
    }
    // Respuesta exitosa
    return res.status(201).json({ message: 'usuario actualizado con exito'});
  
  }catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  } 
});


// ---------------------------- rutas no encontradas -----------------------------
// -------------------------------------------------------------------------------

app.use((req, res, next) => {
    const error = new Error('Ruta no encontrada en la aplicación');
    error.status = 404;
    next(error);
  });

// --------------------- Middleware para manejar errores -------------------------
// -------------------------------------------------------------------------------
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// ---------------------------- iniciar servidor ---------------------------------
// -------------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });