import { config } from 'dotenv';

// Carga las variables de entorno desde el archivo .env
config();

// Configuración de variables de entorno básicas
export const PORT = process.env.PORT || 5000;
export const SESSION_SECRET_PASS = process.env.SESSION_SECRET_PASS;
export const JWT_SECRET_PASS = process.env.JWT_SECRET_PASS;
export const ENVIROMENT = process.env.ENVIROMENT || 'development';

// Configuración base de datos en producción
export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const DB_PORT = process.env.DB_PORT;
export const DB_SSL = process.env.DB_SSL;


// Configuración base de datos en desarrollo
export const DB_DEV_HOST = process.env.DB_DEV_HOST || 'localhost';
export const DB_DEV_NAME = process.env.DB_DEV_NAME || 'v2_data';
export const DB_DEV_USER = process.env.DB_DEV_USER || 'root';
export const DB_DEV_PASS = process.env.DB_DEV_PASS || '';
export const DB_DEV_PORT = process.env.DB_DEV_PORT || 3306;

// Configuración de la conexión
export const DB_POOL_LIMIT = process.env.DB_POOL_LIMIT || '10';
export const DB_QUEUE_LIMIT = process.env.DB_QUEUE_LIMIT || '0';

// Configuración de ambiente 
export const NODE_ENV = process.env.NODE_ENV;

// Configuración de mailing
export const MAIL = process.env.MAIL;
export const PASSWORD_MAIL = process.env.PASSWORD_MAIL;

// Configuración de directorio
export const ROOT_PATH = process.env.ROOT_PATH;