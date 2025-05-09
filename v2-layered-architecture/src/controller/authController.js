import passport from 'passport';
import bcrypt from 'bcrypt';
import validator from 'validator'
import { putPassword, tokenRecovery, markUsedToken, isTokenUsed } from '../models/authModel.js';
import { promiseLogoutUser } from '../utils/authHelper.js';
import connectionDB from '../config/database.js';
import { findUserByEmail } from '../models/userModel.js';
import { recoveryPassword, verifyRecoveryPassword } from '../config/token.js';
import { emailPasswordRecovery, sendMail } from '../utils/sendmail.js';


// ------------------------ login usario email y contraseña ----------------------
// -------------------------------------------------------------------------------
export const loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ 
      success: false, 
      error: info.message || 'Credenciales inválidas',
      status: 400
    });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ 
        success: true, 
        message: 'Login exitoso',
        status: 200,
        user: { id: user.id}}); // TO DO verificar si esto queda en la sesion y que pasa si lo saco
    });
  })(req, res, next);
};

// --------------------------------- logout usario  ------------------------------
// -------------------------------------------------------------------------------

export const httpLogoutUser = (req, res) => { 
  
  // cerrar sesion
  req.logout((err) => {
    if (err) return res.status(500).json({ 
      success: false, 
      error: 'Error al cerrar sesión',
      status: 500
    })
    // Eliminar la cookie
    req.session.destroy((err) => {
      if (err) return res.status(500).json({
        success: false, 
        error: 'Error al destruir la sesión',
        status: 500
      });
    });
  });
  
  // Eliminar la cookie en el cliente
  res.clearCookie('connect.sid', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });


  return res.status(200).json({ 
    success: true,
    message: 'Sesión cerrada',
    status: 200 
  });
};


// ----------------------------- actualizar contraseña ---------------------------
// -------------------------------------------------------------------------------
export const updatePassword = async (req, res) => {
  
  let conn;
  try {
    conn = await connectionDB.getConnection();;
    await conn.beginTransaction()

    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    
    // Verifica si la contraseña anterior es correcta
    const isMatch = await bcrypt.compare(oldPassword, req.user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        error: 'La contraseña actual es incorrecta',
        status : 400
      });
    }
    
    // Verifica que las contraseñas enviadas sean distintas
    if (oldPassword === newPassword) {
      return res.status(400).json({ 
        success : false,
        message: 'La nueva contraseña es identica a la actual',
        status : 400
      });
    }
    
    // Hashear contraseña
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // actualizar contraseña
    const result = await putPassword (conn, userId, newHashedPassword);
    if (!result) throw new Error('Error al actualizar contraseña')

    // Cerrar la sesión actual
    await promiseLogoutUser(req);

    //confirmar transacción
    await conn.commit(); 

    // Respuesta exitosa
    return res.status(201).json({ 
      success : true,
      message: 'contraseña actualizada con exito',
      status : 201
    });

  } catch (error) {
    console.error('Error en deleteUser', error);
    await conn.rollback();
    
    return res.status(500).json({ 
      success: false,
      error: 'Error al actualizar contraseña',
      status: 500
    });
  } finally {
    if (conn) conn.release();
  }
};



// ------------------------ recuperar contraseña (Paso 1) ------------------------
// -------------------------------------------------------------------------------
export const recoveryPasswordEmail = async (req, res) => {
  
  let conn 

  try {
    //obtener conexion
    conn = await connectionDB.getConnection()
    await conn.beginTransaction();

    let {email} = req.body;
    
  
    // dar formato a email
    email = validator.normalizeEmail(email);
    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: "El formato de correo es inválido",
        status: 400
      })
    };

    // verificar si usuario existe por email
    const user = await findUserByEmail(conn, email)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'el email no pertenece a un usuario registrado',
        status: 400
      })
    }

    // crear token
    const token = recoveryPassword(user)
    
    // guardar token en tabla
    const tokenResult = await tokenRecovery(conn, user.id, token)
    if (!tokenResult) throw new Error('Error al guardar el token');
  
    // enviar correo con enlace para recuperar password
    const to = email
    const subject = "Recuperar contraseña"
    const html = emailPasswordRecovery(user.first_name, user.last_name, token)

    const mailResult = await sendMail(to, subject, html)
    if (!mailResult) throw new Error('Error al enviar el correo')
  
    //confirmar transacción 
    await conn.commit();
  
    return res.status(200).json({
      success: true,
      message: 'email enviado con éxito',
      status: 200
    })

  } catch (error) {
    console.error('Error en recoveryPasswordEmail:', error);
    // Revertir la transacción
    await conn.rollback();
    return res.status(500).json({ 
      success: false,
      error: error.message || 'error al recuperar contraseña',
      status: 500
    });    
  } finally {
    if(conn) conn.release();
  }
};


// ------------------------ recuperar contraseña (Paso 2) ------------------------
// -------------------------------------------------------------------------------
export const recoveryPasswordReset = async (req, res) => {
  let conn
  try {

    conn = await connectionDB.getConnection()
    await conn.beginTransaction()

    const token = req.params.token;
    const { password } = req.body;

    
    // verificar token y obtner datos de usuario
    const user = verifyRecoveryPassword(token)
    if (!user){        
      return res.status(400).json({ 
        success: false,
        message: 'token invalido o expirado',
        status: 400
      });
    }
    
    //verificar si el token ya fue usado
    const verifyIsTokenUsed = await isTokenUsed(conn, user.id, token,)
    if (verifyIsTokenUsed[0].is_used === 1){
      return res.status(400).json({ 
        success: false,
        message: 'token usado',
        status: 400
      });
    }
    
    // Hashear contraseña
    const newHashedPassword = await bcrypt.hash(password, 10);

    // actualizar contraseña
    const updateResult = await putPassword (conn, user.id, newHashedPassword);
    if (!updateResult) throw new Error('Usuario no encontrado')

    // marcar token como usado
    const markTokenAsUsed = await markUsedToken(conn, user.id, token)
    if (!markTokenAsUsed) throw new Error('error al cambiar contraseña, intente nuevamente')
    
    // cerrar sesion con passport
    await promiseLogoutUser(req);

    // 2. Eliminar cookie del cliente
    res.clearCookie('connect.sid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    // confirmar transacción
    await conn.commit();

    // Respuesta exitosa
    return res.status(200).json({ 
      success: true,
      message: 'contraseña actualizada con éxito',
      status: 200
    });
 
  }catch (error) {
    console.error('Error en recoveryPasswordReset:', error);
    await conn.rollback();
    
    let currentStatus = 500;
    if (error.message?.includes('expirado')) {
      currentStatus = 400;
    }

    res.status(currentStatus).json({ 
      success: false,
      error: error.message || 'Error recuperar la contraseña',
      status: currentStatus
    });
  }finally {
    if(conn) conn.release();
  }
};