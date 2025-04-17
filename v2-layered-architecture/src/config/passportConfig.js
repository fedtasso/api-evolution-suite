
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { consultarUsuarioPorEmail, consultarUsuarioPorID } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { conexion_Local } from '../config/database.js';


const conexion = conexion_Local;

// configuracion de passport
passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const user = await consultarUsuarioPorEmail(conexion, email);
          if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: 'Contraseña incorrecta' });
          }
          return done(null, user); // Usuario autenticado
        } catch (error) {
          return done(error);
        }
      }
    )
  );



// Serialización del usuario (para sesiones) 
passport.serializeUser((user, done) => {
done(null, user.id); // Guardar solo el ID del usuario en la sesión
});


// Deserialización del usuario
passport.deserializeUser(async (id, done) => {
try {
    const user = await consultarUsuarioPorID(conexion, id);
    done(null, user); // Recuperar el usuario completo
} catch (error) { 
    done(error);
}
});

  export default passport;