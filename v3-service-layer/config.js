import { config } from 'dotenv';

// Carga las variables de entorno desde el archivo .env
config();

// Exporta las variables de entorno necesarias para la aplicación
export const PORT = process.env.PORT;
export const SESSION_SECRET_PASS = process.env.SESSION_SECRET_PASS;
export const JWT_SECRET_PASS = process.env.JWT_SECRET_PASS;
export const HOST = process.env.HOST;
export const DBNAME = process.env.DBNAME;
export const USER = process.env.USER;
export const DBPASS = process.env.DBPASS;
export const MAIL = process.env.MAIL;
export const PASSWORD_MAIL = process.env.PASSWORD_MAIL;
export const BASE_DIR = process.env.BASE_DIR;

// Validación de variables obligatorias en producción
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD'];
if (process.env.NODE_ENV === 'production') {
  requiredEnvVars.forEach(env => {
    if (!process.env[env]) throw new Error(`Missing required env var: ${env}`);
  });
}

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const DB_CONFIG = {
  production: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'prod_db',
    port: parseInt(process.env.DB_PORT || '3306'),
    ssl: process.env.DB_SSL ? JSON.parse(process.env.DB_SSL) : undefined
  },
  development: {
    host: process.env.DB_HOST_LOCAL || 'localhost',
    user: process.env.DB_USER_LOCAL || 'root',
    password: process.env.DB_PASSWORD_LOCAL || '',
    database: process.env.DB_NAME_LOCAL || 'dev_db',
    port: parseInt(process.env.DB_PORT_LOCAL || '3306')
  }
};


