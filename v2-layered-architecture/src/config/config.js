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




