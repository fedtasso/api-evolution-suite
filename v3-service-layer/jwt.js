// Tipos de tokens y sus configuraciones (seguro y dinámico)
const tokenConfigs = {
    recoveryPassword: {
      payloadFields: ['id', 'email'], // Campos a extraer del objeto 'user'
      options: {
        expiresIn: '5m'
      }
    },
    loginPassword: {
      payloadFields: ['email'], // Nunca incluir 'password' en el JWT
      options: {
        expiresIn: '15m'
      }
    }
  };
  
  // Generar token 
  export const generateToken = (user, tokenType = 'recoveryPassword') => {
    const config = tokenConfigs[tokenType];
    if (!config) throw new Error('Tipo de token no válido');
  
    // Construye el payload dinámicamente desde el usuario
    const payload = {};
    config.payloadFields.forEach(field => {
      if (!user[field]) throw new Error(`Campo requerido faltante: ${field}`);
      payload[field] = user[field];
    });
  
    return jwt.sign(payload, JWT_SECRET_PASS, config.options);
  };