import jwt from 'jsonwebtoken';
import { JWT_SECRET_PASS } from './config.js';


// token para recuperar usuario por email
export const tokenRecoveryPasswordEmail = (user) => {
  const payload = {
    id: user.id,
    email: user.email
  };

  const options = {
    expiresIn: '5m'  // El token expirará en 5 minutos
  };

  return jwt.sign(payload, JWT_SECRET_PASS, options);
}

// Función para verificar el token
export const verifyTokenRecoveryPasswordEmail = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_PASS);
    return decoded;  // Token válido
  } catch (error) {
    return null;
  }
}