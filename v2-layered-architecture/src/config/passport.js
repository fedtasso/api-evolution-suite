
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { findUserByEmail, findUserById } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import connectionDB from './database.js';

// configuracion de passport
passport.use(
    new LocalStrategy(
      { usernameField: 'email', 
        passwordField: 'password' 
      },
      async (email, password, done) => {
        try {
          const user = await findUserByEmail(connectionDB, email);
          if (!user) {
            return done(null, false, { message: 'Credenciales invalidas' });
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: 'Credenciales invalidas' });
          }
          return done(null, user); // Usuario autenticado
        } catch (error) {
          return done(error);
        }
      }
    )
  );


// Serialización del usuario 
passport.serializeUser((user, done) => {
done(null, user.id); // Guarda solo el ID del usuario en la sesión
});


// Deserialización del usuario
passport.deserializeUser(async (id, done) => {
try {
    const user = await findUserById(connectionDB, id);
    if(!user){
      return done(null, false);
    }
    done(null, user); // Recuperar el usuario completo
} catch (error) { 
    done(error);
}
});

  export default passport;