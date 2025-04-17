import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { DBNAME, DBPASS, HOST, USER } from './config.js';

dotenv.config();

// Configuración de las conexiones
const dbConfigRemota = {
  host: HOST,
  database: DBNAME,
  user: USER,
  password: DBPASS,
  port: 3306
};

const dbConfigLocal = {
  host: 'localhost',
  database: 'proyecto_fed',
  user: 'root',
  password: '',
  port: 3306
};

async function testConnection(config, label) {
  try {
    const connection = await mysql.createConnection(config);
    console.log(`Conexión a la base de datos ${label} exitosa`);
    await connection.end();
  } catch (error) {
    console.error(`Error al conectar a la base de datos ${label}:`, error.message);
  }
}

async function init() {
  await Promise.all([
    // testConnection(dbConfigRemota, 'proyecto_fed remota'),
    testConnection(dbConfigLocal, 'proyecto_fed local')
  ]);
  

}

init();


// // Configura la conexión a la base de datos MySQL para proyecto_fed remota
// const conexion_Remota = mysql.createPool({
//   ...dbConfigRemota,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// Configura la conexión a la base de datos MySQL para proyecto_fed local
const conexion_Local = mysql.createPool({
  ...dbConfigLocal,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export { conexion_Local }; //conexion_Remota

