import bcrypt from 'bcrypt';
import { capitalizeText } from '../utils/normalizeText.js';
import connectionDB from '../config/database.js';
import { deleteUserById, findUserByEmail, findUserById } from '../models/userModel.js';
import { emailCreatUser } from '../utils/sendmail.js';
import { promiseLogoutUser } from '../utils/authHelper.js';


// ------------------------------ registrar usuario ------------------------------
// -------------------------------------------------------------------------------

export const registerUser = async (req, res) => {

  // declarar conexion
  let conn;
  
  try {        
    // obtener conexión e iniciar transacción
    conn = await connectionDB.getConnection();
    await conn.beginTransaction();

    let { firstName, lastName, password, nationalId, passport, email, phoneNumber, address } = req.body;

    // dar formato a entradas
    firstName = capitalizeText(firstName).trim()
    lastName = capitalizeText(lastName).trim()
    email = email.toLowerCase()

    // verificar si usuario existe por email
    const userExists = await findUserByEmail(conn, email)
    console.log("verificar que userExist de el valor correcto", userExists) // TO DO
    if (userExists) {
      return res.status(409).json({
        success: false, 
        message : 'el usuario ya se encuentra registrado',
        status: 409
      })
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en tabla usuarios
    const insertId = await createUser(conn, firstName, lastName, hashedPassword, nationalId, passport, email, phoneNumber, address);
    if (!insertId) {
      throw new Error('error al crear el usuario en la base de datos')      
    }

    // enviar correo de registro
    const to = email
    const subject = `¡Bienvenido/a ${firstName} a V2 API Layered Architecture!`
    const html = emailCreatUser

    const mailResult = await sendMail (to, subject, html)

    //verificar si mail fue enviado
    let mailStatus = 'email enviado con exito'
    if (!mailResult) {
      mailStatus = 'error al enviar el email'
      }
    
    //confirmar transacción
    await conn.commit();

    // Respuesta exitosa
    return res.status(201).json({
      success: false,
      message: 'Usuario creado exitosamente',
      details : {
        userId: insertId,
        sendMail : mailStatus
      }
    });
       

  } catch (error) {
    // Revertir la transacción
    console.error('Error en registerUser:', error)
    await conn.rollback();    

    res.status(500).json({ 
      success: false, 
      message : error.message || 'error al crear el usuario',
      status: 500       
     });
  } finally {
    // Libera la conexión al pool
   if (conn) conn.release();
    }
}; 




// // --------------------- buscar usuario por nombre o apellido ----------------------
// // -------------------------------------------------------------------------------
// // TO DO refactorizar
// export const getUser = async (req, res) => {    
//     let {firstName} = req.query;

// try {
//     // buscar todos los usuarios
//     const result = await findUsers(conexion);
//     let user = result

//     // filtros 
//     if (firstName){
//       // dar formato a entradas
//       firstName = capitalizeText(firstName).trim()      
//       // buscar usuario por nombre
//       user = buscarNombre(firstName, result)
//     }

//     // respuesta usuario no encontrado
//     if (!user) {
//       return res.status(400).json({
//       message: 'no se ha encontrado ningun usuario con la busqueda seleccionada'})
//       }

//     //respuesta exitosa
//     return res.status(201).json({
//         message: 'usuario encontrado exitosamente',
//         usuarios: user   
//     });
// } catch (error) {
//     res.status(500).json ({error : 'error al buscar el usuario'})
// }
// }




// ---------------------------- buscar usuario por ID ----------------------------
// -------------------------------------------------------------------------------
export const getUserByID = async (req, res) => {    
  
  let conn;
try {  
  // obtener conexión
  conn = await connectionDB.getConnection();
  
  // datos de usuario del front
  const userId = req.params.id;

  // buscar usuario
  const user = await findUserById(conn, userId);

  if (!user) return res.status(404).json({    
    success: false, 
    message : 'id de usuario no encontrado',
    status: 404
  })
  
  // Eliminar la contraseña del objeto datosUsuario
  delete user.password;

  //respuesta exitosa
  return res.status(200).json({
      success: true, 
      message: 'usuario encontrado exitosamente',
      usuario: user,
      status: 200
  });

  } catch (error) {
    console.error('Error en getUserByID:', error);
    res.status(500).json({ 
      success: false, 
      message : 'error al buscar el usuario',
      status: 500
    })

  } finally {
   if (conn) conn.release();
  }
}



// ------------------------------- borrar usuario --------------------------------
// -------------------------------------------------------------------------------
export const deleteUSer  = async (req, res) => {
    
    // declarar conexión
    let conn
  
    try {
          
      // obtener conexión e iniciar transacción
      conn = await connectionDB.getConnection();;
      await conn.beginTransaction()

      //datos de usuario
      const userId = req.user.id;
      
      //borrar usuario
      const result = await deleteUserById(conn, userId)
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
          status : 404 
        });
      }
      
      // cerrar sesion con passport
      await promiseLogoutUser(req);

      // 2. Eliminar cookie del cliente
      res.clearCookie('connect.sid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    });

      //confirmar transacción
      await conn.commit(); 

      // Respuesta exitosa
      return res.status(200).json({ 
        success : true,
        message: 'usuario borrado con exito',
        status : 200
      });
  
    } catch (error) {      
      console.error('Error en deleteUser', error);
      await conn.rollback();

      res.status(500).json({ 
        success: false, 
        message : 'Error al borrar el usuario',
        status: 500,
        details : {
          sesion : error.message
        }
      })      
    
    } finally {
     if (conn) conn.release();
    }
};


// ------------------------------- actualizar usuario --------------------------------
// -------------------------------------------------------------------------------
export const putUser  = async (req, res) => {
  
  let conn;

  try {
    // obtener conexion
    conn = await connectionDB.getConnection();

    //datos de usuario    
    let { firstName, lastName, email, phoneNumber, address } = req.body;

    const userId = req.user.id;

    
    // verificar compos con informacion para validar
    const userInput = {}
    
    if (firstName) userInput.firstName = capitalizeText(firstName).trim();
    if (lastName) userInput.lastName = capitalizeText(lastName).trim()
    if (email) userInput.email = email.toLowerCase()    
    if (phoneNumber) userInput.phoneNumber = phoneNumber.trim();
    if (address) userInput.address = address.trim();
    
    // verificar que haya informacion a validar
    if (Object.keys(userInput).length === 0){
      return res.status(400).json({ 
        success: false, 
        error : "No se recibió información para actualizar",
        status: 400})
    };
    
    
    // obtener usuario actual    
    const currentUser = await findUserById(conn, userId)
    if (currentUser.phoneNumber){
    currentUser.phoneNumber = currentUser.phoneNumber.toString()
    }
    
    //iniciar objeto con informacion a actualizar
    const updateFields = {}  

    // comparar informacion  
    for (let key in userInput){
      if(userInput[key] !== currentUser[key]){
        updateFields[key] = userInput[key]
      }
    }

    // Verificar si hay datos para actualizar
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "No hay información para actualizar",
        status : 400 });
    }

    // verificar que el mail no pertenezca a otro usuario antes de actualizar 
    if (updateFields.email) {
      const emailExists = await findUserByEmail(conn, userInput.email)
      
      if (emailExists) {
        return res.status(400).json({ 
          success: false, 
          message: 'el email pertenece a un usuario inscripto',
          status : 400
          });
        }
    }     
    
    // actualizar datos de usuario
    const updateResult = await updateUser(conn, updateFields, currentUser.id);
   
    if (!updateResult) return res.status(400).json({
      success: false,
      error: 'error al actualizar el usuario',
      status : 400
    })
    
    // Respuesta exitosa
    return res.status(201).json({ 
      success: true,
      message: 'usuario actualizado con exito',
      status : 201
    });
  
  } catch 
      (error) {   
      console.error('Error en updateUser', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error al actualizar el usuario',
        status: 500,
    });
  } finally {
      // Libera la conexión al pool
      if (conn) conn.release();
  } 
};