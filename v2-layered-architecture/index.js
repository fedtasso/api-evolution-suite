import express from 'express';
import { PORT } from './src/config/config.js';
import cors from 'cors';
import passport from './src/config/passportConfig.js';

import userRoutes from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import { testConnection } from './src/config/database.js';


const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// iniciar session
app.use(sessionConfig)

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas de la API
app.use('/', userRoutes);
app.use('/', authRoutes);


// Manejo de rutas no encontradas
app.use((req, res, next) => {
  const error = new Error('Ruta no encontrada en la aplicación');
  error.status = 404;
  next(error);
});

// Middleware para manejar errores
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// Iniciar servidor
await testConnection();
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});