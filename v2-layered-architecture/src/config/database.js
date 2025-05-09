import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import {DB_HOST, DB_DEV_HOST, DB_DEV_NAME, DB_DEV_PASS, DB_DEV_PORT, DB_DEV_USER, DB_NAME, DB_PASS, DB_POOL_LIMIT, DB_PORT, DB_QUEUE_LIMIT, DB_USER, ENVIRONMENT, DB_SSL } from './config.js';

// Cargar variables de entorno
dotenv.config();

// Configuraciones para diferentes entornos
const configDB = {
  production: {
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASS,
    port: DB_PORT
    
  },
  development: {
    host: DB_DEV_HOST,
    database: DB_DEV_NAME,
    user: DB_DEV_USER,
    password: DB_DEV_PASS,
    port: DB_DEV_PORT
  }
};

// Seleccionar configuración según el entorno
export const currentConfig = configDB[ENVIRONMENT];

// Crear pool de conexiones
const connectionDB = mysql.createPool({
  ...currentConfig,
  connectTimeout: 10000,
  waitForConnections: true,
  connectionLimit: parseInt(DB_POOL_LIMIT),
  queueLimit: parseInt(DB_QUEUE_LIMIT),
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});


// Función para probar la conexión
async function testConnection() {
  let connection;
  try {
    connection = await connectionDB.getConnection();
    console.log(`Conexión a la base de datos (${currentConfig.host}) exitosa`);
    await connection.query('SELECT 1');
  } catch (error) {
    console.log(currentConfig)
    console.error(`Error al conectar a la base de datos (${currentConfig.host}):`, error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Exporta el pool como default (para uso principal)
export default connectionDB;


// Exportar utilidades
export { testConnection, currentConfig as configDB };