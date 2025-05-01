import { createUser, findUsers, consultarUsuarioPorEmail, consultarUsuarioPorID, deleteUserByID, updateUser } from '../models/userModel.js';
import { conexion_Local } from '../config/database.js';
import { buscarNombre} from '../utils/userFilters.js';
import { sendMail } from '../utils/sendmail.js';
import { capitalizeText } from '../utils/normalizeText.js';
import bcrypt from 'bcrypt';

const conexion = conexion_Local;

// ------------------------------ registrar usuario ------------------------------
// -------------------------------------------------------------------------------

export const registerUser = async (req, res) => {

  //obtener conexion para transaccion
  const transaccionConexion = await conexion.getConnection();
  
  try {
        
    // Inicia la transacción
    await transaccionConexion.beginTransaction();

    let { nombre, apellido, password, dni, pasaporte, email, telefono, direccion } = req.body;

    // dar formato a entradas
    nombre = capitalizeText(nombre).trim()
    apellido = capitalizeText(apellido).trim()
    email = email.toLowerCase()

    // verificar si usuario existe por email
    const existeusuario = await consultarUsuarioPorEmail(transaccionConexion, email)
    if (existeusuario) {
      return res.status(400).json({message : 'el usuario ya se encuentra registrado'})
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en tabla usuarios
    const insertId = await createUser(transaccionConexion, nombre, apellido, hashedPassword, dni, pasaporte, email, telefono, direccion);
    if (!insertId) {
      // TO DO trow new error??? para que haga el rollback
      return res.status(400).json({message : 'error al crear el usuario'})
    }
    console.log(email)
    // enviar correo de registro
    const to = email
    const subject = "Bienvenido a Pro Code Camp"
    const text = `Bienvenido ${nombre} ${apellido} a Pro Code Camp`

    const mailResult = await sendMail (to, subject, text)
    if (!mailResult) {
      return res.status(500).json({ error: 'Error al enviar el correo' });
    }
    
    //confirmar transacción
    await transaccionConexion.commit();

    // Respuesta exitosa
    return res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuario_id: insertId // Devuelve el ID
    });
       

  } catch (error) {
    // Revertir la transacción
    console.log(error)
    await transaccionConexion.rollback();
    res.status(500).json({ error: 'Error al crear el usuario' });
  } finally {
    // Libera la conexión al pool
   transaccionConexion.release();
    }
}; 




// --------------------- buscar usuario por nombre o apellido ----------------------
// -------------------------------------------------------------------------------

export const getUser = async (req, res) => {    
    let {nombre} = req.query;

try {
    // buscar todos los usuarios
    const result = await findUsers(conexion);
    let user = result

    // filtros 
    if (nombre){
      // dar formato a entradas
      nombre = capitalizeText(nombre).trim()      
      // buscar usuario por nombre
      user = buscarNombre(nombre, result)
    }

    // respuesta usuario no encontrado
    if (!user) {
      return res.status(400).json({
      message: 'no se ha encontrado ningun usuario con la busqueda seleccionada'})
      }

    //respuesta exitosa
    return res.status(201).json({
        message: 'usuario encontrado exitosamente',
        usuarios: user   
    });
} catch (error) {
    res.status(500).json ({error : 'error al buscar el usuario.'})
}
}




// ---------------------------- buscar usuario por ID ----------------------------
// -------------------------------------------------------------------------------
export const getUserByID = async (req, res) => {    
  const id = req.params.id;

try {

  // buscar todos los usuarios
  const datosUsuario = await consultarUsuarioPorID(conexion, id);

  if (!datosUsuario) return res.status(400).json({
    message: 'id de usuario no encontrado'})
  
  // Eliminar la contraseña del objeto datosUsuario
  delete datosUsuario.password;

  //respuesta exitosa
  return res.status(201).json({
      message: 'usuario encontrado exitosamente',
      usuario: datosUsuario 
  });
  } catch (error) {
    res.status(500).json ({error : 'error al buscar el usuario.'})
  }
}



// ------------------------------- borrar usuario --------------------------------
// -------------------------------------------------------------------------------
export const deleteUSer  = async (req, res) => {
    
    //obtener conexion para transaccion
    const transaccionConexion = await conexion.getConnection();
  
    try {
          
      // Inicia la transacción
      await transaccionConexion.beginTransaction()
      const usuarioId = req.user.id;
      
      //borrar usuario en tablas relacionadas y luego en tabla principal
      const result = await deleteUserByID(transaccionConexion, usuarioId )

      if (!result) {
        await transaccionConexion.rollback();
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
     
      // Cerrar la sesión actual usando la función logoutUser
      req.logout((err) => {
          if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });          
        });

      //confirmar transacción
      await transaccionConexion.commit(); 

      // Respuesta exitosa
      return res.status(201).json({ message: 'usuario borrado con exito'});
  
    } catch (error) {      
      await transaccionConexion.rollback();
      res.status(500).json({ error: 'Error al borrar el usuario' });
    } finally {
      // Libera la conexión al pool
     transaccionConexion.release();
    }
};


// ------------------------------- actualizar usuario --------------------------------
// -------------------------------------------------------------------------------
export const putUSer  = async (req, res) => {
  
  try {
    //obtener campos del front    
    let { nombre, apellido, email, telefono, direccion } = req.body;
    const usuario_id = req.user.id;

    
    // verificar compos con informacion para validar
    const usuarioFront = {}
    
    if (nombre) {
      nombre = capitalizeText(nombre).trim();
      usuarioFront.nombre = nombre;
    }

    if (apellido) {
      apellido = capitalizeText(apellido).trim()
      usuarioFront.apellido = apellido;
    }
               
    if (email) {
      email = email.toLowerCase()
      usuarioFront.email = email;;
    }
    
    if (telefono) {
      usuarioFront.telefono = telefono;
    }
    
    if (direccion) {
      usuarioFront.direccion = direccion;
    }
    
    // verificar que haya informacion a validar
    if (Object.keys(usuarioFront).length === 0){
      return res.status(400).json({ error : "No se recibió información para actualizar."})
    };
    
    
    // buscar informacion del usuario en la bbdd     
    const usuarioBBDD = await consultarUsuarioPorID(conexion, usuario_id)
    
    // convertir telefono en string para comparar con front
    usuarioBBDD.telefono = usuarioBBDD.telefono.toString()

    //iniciar objeto con informacion a actualizar
    const UpdateInfoUsuario = {}  

    // verificar si la informacion es igual a la almacenada en BBDD  
    for (let clave in usuarioFront){
      if(usuarioFront[clave] !== usuarioBBDD[clave]){
        UpdateInfoUsuario[clave] = usuarioFront[clave]
      }
    }

    // Verificar si hay datos para actualizar
    if (Object.keys(UpdateInfoUsuario).length === 0) {
      return res.status(400).json({ error: "No hay información para actualizar." });
    }

    // verificar que el mail no pertenezca a otro usuario antes de actualizar 
    if (UpdateInfoUsuario.email) {
      const mailExiste = await consultarUsuarioPorEmail(conexion, usuarioFront.email)
      
      if (mailExiste) {
        return res.status(400).json({ message: 'el mail ya pertenece a un usuario inscripto'});
        }
    }     
    console.log(UpdateInfoUsuario)
    // actualizar datos de usuario
    const actualizarUsuario = await updateUser(conexion, UpdateInfoUsuario, usuario_id);
   
    if (!actualizarUsuario) return res.status(400).json({error: 'error al actualizar el usuario'})
    
    // Respuesta exitosa
    return res.status(201).json({ message: 'usuario actualizado con exito'});
  
  } catch (error) {         
      res.status(500).json({ error: 'Error al actualizar el usuario' });
  } 
};