import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt, { compareSync } from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

//configuración inicial
const app = express();
const PORT = process.env.PORT || 5000
dotenv.config();


// middleware json
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


// token para verificar login de usuario
const authToken = (userId) => {
  const payload = {
    userId
  };
  const options = {
    expiresIn: '2h'  // El token expirará en 2 horas
  };
  return jwt.sign(payload, process.env.JWT_SECRET_PASS, options);
};


// Función para verificar token
const verifyAuthToken = (userAuthToken) => {
  try {
    const decoded = jwt.verify(userAuthToken, process.env.JWT_SECRET_PASS);
    return decoded;  // Token válido
  } catch (error) {
    return null;
  }
};


// token para recuperar usuario por email
export const tokenRecoveryPasswordEmail = (userId) => {
  const payload = {
    userId
  };
  const options = {
    expiresIn: '5m'  // El token expirará en 5 minutos
  };
  return jwt.sign(payload, process.env.JWT_SECRET_PASS, options);
}


// Función para verificar token
export const verifyTokenRecoveryPasswordEmail = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_PASS);
    return decoded;  // Token válido
  } catch (error) {
    return null;
  }
}


// ------------------------------ registrar usuario ------------------------------
// -------------------------------------------------------------------------------

app.post('/v1/monolithic/user', async (req, res) => {
       
    try {
        
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
      const [userExists] = await pool.query(`SELECT id FROM users WHERE email = ?  LIMIT 1`, [email] )
      if (userExists.length > 0) {
        return res.status(409).json({message : 'el usuario ya se encuentra registrado'})
      }
  
      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Crear el usuario en tabla users
      const [result] = await pool.query(`INSERT INTO users 
        (firstName, lastName, password, nationalId, passport, email, phoneNumber, address) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [firstName, lastName, hashedPassword, nationalId, passport, email, phoneNumber, address]
      );

      // enviar email de usuario creado      
      try {
            await transporter.sendMail({
                from: process.env.MAIL,
                to: email,
                subject: `Bienvenido ${firstName}`,
                text: `Hola ${firstName} ${lastName}.
                Gracias por registrarte en api-monolithic.`
            });
        } catch (mailError) {
            console.error('Error enviando email:', mailError);
        }
      
      // Respuesta exitosa
      return res.status(201).json({
        message: 'Usuario creado exitosamente',
        userId: result.insertId, // Devuelve el ID
      });

    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al crear el usuario' });
    } 
  } )

// ------------------------ login usario con email y contraseña ----------------------
// -------------------------------------------------------------------------------

app.post('/v1/monolithic/user/login', async (req, res) => {
       
  try {    
    // obtener parametros desde body
    let { password, email } = req.body;
    
    if (!password || !email) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // dar formato a entradas
    email = email.toLowerCase().trim()

    // recuperar datos de usuario en db 
    const [users] = await pool.query(`SELECT id, password FROM users WHERE email = ?`, [email] )
   
    //verificar si usuario existe
    if (users.length < 1) {
      return res.status(404).json({message : 'el usuario no se encuentra registrado'})
    }
  
    const [user] = users

    // comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401 ).json({message : 'contraseña incorrecta'})
    }

    const userAuthToken = authToken(user.id)

    return res.status(200).json({
      message : 'login exitoso',
      token: userAuthToken,
      id: user.id
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al loguear el usuario' });
  } 
})


// ------------------------------ buscar usuario ------------------------------
// -------------------------------------------------------------------------------

app.get('/v1/monolithic/users', async (req, res) => {
       
  try {

    // obtener parametros desde url
    let {firstName, lastName} = req.query;

    // variables para buscar usuarios
    let findUserByFirstName;
    let findUserByLastName;

    const [allUsers] = await pool.query(`SELECT id, firstName, lastName, nationalId, passport, email, phoneNumber, address FROM users`);

    // buscar usuario por nombre
    if (firstName){
      firstName = firstName.toLowerCase().trim()
      const [rows] = await pool.query(`SELECT id, firstName, lastName, nationalId, passport, email, phoneNumber, address FROM users WHERE firstName = ?`, [firstName]);
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
      const [rows] = await pool.query(`SELECT id, firstName, lastName, nationalId, passport, email, phoneNumber, address FROM users WHERE lastName = ?`, [lastName]);
      if (rows.length < 1) {
        return res.status(404).json({
          message: 'no se ha encontrado ningun usuario con el apellido seleccionado'})
      }else {
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

app.get('/v1/monolithic/user/:userId', async (req, res) => {

  try {

    // obtener parametros
    const userId = req.params.userId;

    // buscar todos los usuarios
    const [result] = await pool.query(`SELECT id, firstName, lastName, nationalId, passport, email, phoneNumber, address FROM users WHERE id = ?`, [userId])

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


// ------------------------------- borrar usuario con token --------------------------------
// -------------------------------------------------------------------------------
app.delete('/v1/monolithic/user', async (req, res) => {
  
  try {
   
    // obtener parametros
    const {userToken} = req.body;

    if (!userToken) {
      return res.status(400).json({ message: 'token es requerido' });
    }

    //validar token
    const verifyToken = verifyAuthToken(userToken)

    // Verificar Token
    if (!verifyToken){        
      return res.status(400).json({ message: 'token invalido o expirado' });
    }

    //obtener id de usuario desde token
    const userId = verifyToken.userId

    //borrar usuario
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    // verificar si usuario existe
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
app.put('/v1/monolithic/user', async (req, res) => {
  
  try {

    //obtener parametros   
    let { firstName, lastName, email, phoneNumber, address, userToken } = req.body;

    if (!userToken) {
      return res.status(400).json({ message: 'token es requerido' });
    }
    
    //validar token
    const verifyToken = verifyAuthToken(userToken)
    
    // Verificar Token
    if (!verifyToken){        
      return res.status(400).json({ message: 'token invalido o expirado' });
    }

    //obtener id de usuario desde token
    const userId = verifyToken.userId

    
    // verificar compos con informacion para validar
    const userDataFront = {}
    if (firstName) {
      firstName = firstName.toLowerCase().trim();
      userDataFront.firstName = firstName;
    }
    
    if (lastName) {
      lastName = lastName.toLowerCase().trim()
      userDataFront.lastName = lastName;
    }
    
    if (email) {
     email = email.toLowerCase().trim()
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
    const [usersDataDB] = await pool.query(`SELECT id, firstName, lastName, nationalId, passport, email, phoneNumber, address FROM users WHERE id = ?`, [userId])
    
    // varificar si id de usuario existe
    if(usersDataDB.length < 1){
      return res.status(404).json({ error: "El id de usuario es incorrecto." });      
    }

    const [userDataDB] = usersDataDB    
    
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
      const [[emailExists]] = await pool.query(`SELECT email FROM users WHERE email = ?`, [email])
      
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
    
    const [result] = await pool.query(query, params);

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

// ----------------------------- actualizar contraseña ---------------------------
// -------------------------------------------------------------------------------
app.put('/v1/monolithic/user/update-password', async (req, res) => {
  
  try {

    //obtener parametros   
    const { oldPassword, newPassword, userToken } = req.body;

    if (!userToken || !oldPassword || !newPassword) {
      return res.status(400).json({ message: 'token y password son requeridos' });
    }

    //validar token
    const verifyToken = verifyAuthToken(userToken)

    // Verificar Token
    if (!verifyToken){        
      return res.status(400).json({ message: 'token invalido o expirado' });
    }

    //obtener id de usuario desde token
    const userId = verifyToken.userId

    // buscar password de usuario en db  
    const [usersData] = await pool.query(`SELECT password FROM users WHERE id = ?`, [userId]);
    
    // varificar si id de usuario existe
    if(usersData.length < 1){
      return res.status(404).json({ error: "El usuario no existe." });      
    }

    const [userData] = usersData
        
    // Verifica si la contraseña anterior es correcta
    const isMatch = await bcrypt.compare(oldPassword, userData.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });}
    
    // Verifica que las contraseñas enviadas sean distintas
    if (oldPassword === newPassword) {
      return res.status(400).json({ message: 'La nueva contraseña es identica a la actual' });}
    
    // Hashear contraseña
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // actualizar contraseña
    const result = await pool.query(`UPDATE users SET password = ? WHERE id = ?`, [newHashedPassword, userId]);

    if (result.affectedRows < 1) {
      return res.status(400).json({error: 'error al actualizar la contraseña'})
    }

    // Respuesta exitosa
    return res.status(201).json({ message: 'contraseña actualizada con exito'});
 
  } catch (error) {
    console.log(error)
      res.status(500).json({ error: 'Error al actualizar contraseña' });
  }
});



// ------------------------ recuperar contraseña (Paso 1) ------------------------
// -------------------------------------------------------------------------------

app.put('/v1/monolithic/user/recovery-password/email', async (req, res) => {
  
  try {

    //obtener parametros   
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'email es requerido' });
    }

    // dar formato a email
    email = email.toLowerCase().trim();
    
    // verificar si usuario existe por email
    const [userExists] = await pool.query(`SELECT id FROM users WHERE email = ?`, [email] )
    if (userExists.length < 1) {
      return res.status(409).json({message : 'el usuario no se encuentra registrado'})
    }

    const [user] = userExists

    // crear token
    const token = tokenRecoveryPasswordEmail(user.id)

    // enviar email para recuperar password      
      try {
        await transporter.sendMail({
            from: process.env.MAIL,
            to: email,
            subject: "Recuperar contraseña",
            text: `Nos comunicamos desde monolothic api. Hemos recibido una solicitud para recuperar su contraseña.
    Haz clic en el enlace a continuación o cópialo y pégalo en tu navegador. Luego, sigue las instrucciones en la página para restablecer tu contraseña:
    
    Enlace:
    ${process.env.BASE_DIR}/v1/monolithic/user/reset-password/${token}
    
    Si no ha solicitado recuperar su contraseña, por favor ignore este correo.`
        });
      } catch (mailError) {
        console.error(mailError);
        return res.status(500).json({ error: 'Error al enviar el correo' });
      }
    
    return res.status(200).json({message : 'email enviado con exito'})

} catch (error) {
  console.log(error)
    res.status(500).json({ error: 'Error al recuperar contraseña' });
}
});


// ------------------------ recuperar contraseña (Paso 2) ------------------------
// -------------------------------------------------------------------------------

app.put('/v1/monolithic/user/recovery-password/reset/:token', async (req, res) => {
  
  try {

    //obtener parametros   
    const token = req.params.token;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'token y password son requeridos' });
    };

    // validar token
    const verifyToken = verifyTokenRecoveryPasswordEmail(token)

    // verificar token
    if (!verifyToken){        
      return res.status(400).json({ message: 'token invalido o expirado' });
    }

    const userId = verifyToken.userId

    // Hashear contraseña
    const newHashedPassword = await bcrypt.hash(password, 10);
    
    // actualizar contraseña
    const result = await pool.query(`UPDATE users SET password = ? WHERE id = ?`, [newHashedPassword, userId]);
    
    if (result.affectedRows < 1) {
      return res.status(400).json({error: 'error al actualizar la contraseña'})
    }

    // Respuesta exitosa
    return res.status(201).json({ message: 'contraseña actualizada con exito'});
  
  } catch (error) {
    console.log(error)
      res.status(500).json({ error: 'Error al actualizar contraseña' });
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