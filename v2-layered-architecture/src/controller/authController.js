import passport from 'passport';
import { BASE_DIR } from '../config/config.js';
import { conexion_Local } from '../config/database.js';
import bcrypt from 'bcrypt';
import validator from 'validator'
import { putPassword, token_recovery } from '../models/authModel.js';
import { consultarUsuarioPorEmail } from '../models/userModel.js';
import { sendMail } from '../utils/sendmail.js';
import { tokenRecoveryPasswordEmail, verifyTokenRecoveryPasswordEmail } from '../config/tokenConfig.js';

const conexion = conexion_Local

// ------------------------ login usario email y contraseña ----------------------
// -------------------------------------------------------------------------------
export const loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: 'Login exitoso'});
    });
  })(req, res, next);
};

// ------------------------ logout usario todos los metodos ----------------------
// -------------------------------------------------------------------------------
export const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
     // Eliminar la cookie de sesión
     req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Error al destruir la sesión' });

    // Asegurarte de eliminar la cookie en el cliente
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Sesión cerrada' });
  });
});
};


// ----------------------------- actualizar contraseña ---------------------------
// -------------------------------------------------------------------------------
export const updatePassword  = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { oldPassword, newPassword } = req.body;
        
        // Verifica si la contraseña anterior es correcta
        const isMatch = await bcrypt.compare(oldPassword, req.user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'La contraseña actual es incorrecta' });}
        
        // Verifica que las contraseñas enviadas sean distintas
        if (oldPassword === newPassword) {
          return res.status(400).json({ message: 'La nueva contraseña es identica a la actual' });}
        
        // Hashear contraseña
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // actualizar contraseña
        const result = await putPassword (conexion, usuarioId, newHashedPassword);

        // Cerrar la sesión actual usando la función logoutUser
        req.logout((err) => {
            if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });          
          });

        // Respuesta exitosa
        return res.status(201).json({ message: 'contraseña actualizada con exito'});
   
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar contraseña' });
    } // finally {
    //   if  connection.release();
    // }
};



// ------------------------ recuperar contraseña (Paso 1) ------------------------
// -------------------------------------------------------------------------------
export const recoveryPasswordEmail  = async (req, res) => {
  
  //obtener conexion para transaccion
  const transaccionConexion = await conexion.getConnection();

  try {

    // Inicia la transacción
    await transaccionConexion.beginTransaction();

    let {email} = req.body;
    
  
    // dar formato a email
    email = validator.normalizeEmail(email);
    if (!email) {
      return res.status(400).json({ error : "El formato de correo es inválido."})};

    // verificar si usuario existe por email
    const usuario = await consultarUsuarioPorEmail(transaccionConexion, email)
    if (!usuario) {
      return res.status(400).json({message : 'el email no pertenece a un usuario registrado'})
    }

    // crear token
    const token = tokenRecoveryPasswordEmail(usuario)
    
    // guardar token en tabla
    const result = await token_recovery (transaccionConexion, usuario.id, token)
    // marcar como usado, con fecha , etc

    // enviar correo con enlace para recuperar password
    const to = email
    const subject = "Recuperar contraseña"
    const text = `Nos comunicamos desde nuestra Pro Code Camp porque hemos recibido una solicitud para recuperar su contraseña.
Haz clic en el enlace a continuación o cópialo y pégalo en tu navegador. Luego, sigue las instrucciones en la página para restablecer tu contraseña:

Enlace:
${BASE_DIR}/recuperar-password/reset/${token}

Si no ha solicitado recuperar su contraseña, por favor ignore este correo.`

    const mailResult = await sendMail(to, subject, text)
    if (!mailResult) {
      return res.status(500).json({ error: 'Error al enviar el correo' });
    }
  
    //confirmar transacción 
    await transaccionConexion.commit();
  
    return res.status(200).json({message : 'email enviado conexito'})

  } catch (error) {
    // Revertir la transacción
    await transaccionConexion.rollback();
    res.status(500).json({ error: 'error al recuperar contraseña' });
  } finally {
    // Libera la conexión al pool
    transaccionConexion.release();
    }
};


// ------------------------ recuperar contraseña (Paso 2) ------------------------
// -------------------------------------------------------------------------------
export const recoveryPasswordReset = async (req, res) => {
  try {
      const token = req.params.token;
      const {password } = req.body;

      // verificar token y obtner datos de usuario
      const usuario = verifyTokenRecoveryPasswordEmail(token)
      if (!usuario){        
        return res.status(400).json({ message: 'token invalido o expirado' });
      }
      
      // Hashear contraseña
      const newHashedPassword = await bcrypt.hash(password, 10);

      // actualizar contraseña
      const result = await putPassword (conexion, usuario.id, newHashedPassword);

      // TO DO Cerrar sesiónes antiguas

      // Respuesta exitosa
      return res.status(201).json({ message: 'contraseña actualizada con exito'});
 
  } catch (error) {    
      res.status(500).json({ error: 'Error recuperar la contraseña' });
  }
};