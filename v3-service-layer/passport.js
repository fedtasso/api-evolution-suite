import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { findUserByEmail, findUserById } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import connectionDB from './database.js';
import logger from '../utils/logger.js'; // Asumiendo que tendrás logger en v3

// --- Configuración de Estrategia Local ---
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // Opcional: para acceso al request
    },
    async (req, email, password, done) => {
      try {
        const user = await findUserByEmail(connectionDB, email);
        
        if (!user) {
          logger.warn(`Intento de login fallido - Email no encontrado: ${email}`);
          return done(null, false, { message: 'Credenciales inválidas' }); // Mensaje genérico por seguridad
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          logger.warn(`Intento de login fallido - Password incorrecto para usuario: ${user.id}`);
          return done(null, false, { message: 'Credenciales inválidas' });
        }

        logger.info(`Login exitoso - Usuario: ${user.id}`);
        return done(null, user);

      } catch (error) {
        logger.error(`Error en autenticación: ${error.message}`, { stack: error.stack });
        return done(error);
      }
    }
  )
);

// --- Serialización ---
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// --- Deserialización Mejorada ---
passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(connectionDB, id);
    
    if (!user) {
      logger.warn(`Usuario no encontrado durante deserialización: ${id}`);
      return done(null, false);
    }
    
    done(null, user);
  } catch (error) {
    logger.error(`Error en deserialización: ${error.message}`);
    done(error);
  }
});

export default passport;






📌 Recomendaciones Adicionales:
Para tu v3 (Clean Architecture):

javascript
// En tu capa de infraestructura/auth/passport.js
export const configurePassport = (dependencies) => {
  const { userRepository, logger } = dependencies;
  
  passport.use(new LocalStrategy(/* ... */));
  // Resto de configuración
  return passport;
};
Protección contra Timing Attacks:

javascript
// En tu userModel.js
async function findUserByEmail(email) {
  // Usar esta consulta para evitar diferencias de tiempo
  const [user] = await connection.query(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return user || null;
}
Tipado (si usas TypeScript en el futuro):

typescript
interface User {
  id: number;
  email: string;
  password: string;
  // ...otros campos
}

declare global {
  namespace Express {
    interface User extends LocalUser {}
  }
}