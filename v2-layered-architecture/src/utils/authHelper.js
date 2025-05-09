export const promiseLogoutUser = (req) => {
    return new Promise((resolve, reject) => {
      req.logout((err) => {
        if (err) return reject(new Error('Error al cerrar sesión'));
        
        req.session.destroy((err) => {
          if (err) return reject(new Error('Error al destruir sesión'));

        // // Eliminar la cookie en el cliente
        // res.clearCookie('connect.sid', { //TO DO dejarlo acá y sacarlo del controlador
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === 'production',
        //   sameSite: 'strict',
        //   path: '/'
        // });
      
          resolve(); // Éxito
        });
      });
    });
  };
