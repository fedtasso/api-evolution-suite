export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); // El usuario está autenticado, sigue con la ejecución de la ruta
      
    } else {
      return res.status(401).json({ 
        success: false,
        message: 'No autorizado. Debes iniciar sesión',
        status: 401
      });
    }
  }