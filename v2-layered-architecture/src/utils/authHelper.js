export const promiseLogoutUser = (req) => {
    return new Promise((resolve, reject) => {
      req.logout((err) => {
        if (err) return reject(new Error('Error al cerrar sesión'));
        
        req.session.destroy((err) => {
          if (err) return reject(new Error('Error al destruir sesión'));
      
          resolve(); // Éxito
        });
      });
    });
  };
