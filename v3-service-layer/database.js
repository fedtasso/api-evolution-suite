import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { DBNAME, DBPASS, HOST, USER, DB_PORT, NODE_ENV } from './config.js';

dotenv.config();

// Configuración para diferentes entornos
const dbConfigs = {
  production: {
    host: HOST,
    database: DBNAME,
    user: USER,
    password: DBPASS,
    port: DB_PORT || 3306,
    ssl: process.env.DB_SSL ? JSON.parse(process.env.DB_SSL) : undefined
  },
  development: {
    host: process.env.DB_LOCAL_HOST || 'localhost',
    database: process.env.DB_LOCAL_NAME || 'v2_data',
    user: process.env.DB_LOCAL_USER || 'root',
    password: process.env.DB_LOCAL_PASS || '',
    port: process.env.DB_LOCAL_PORT || 3306
  },
  test: {
    host: process.env.DB_TEST_HOST || 'localhost',
    database: process.env.DB_TEST_NAME || 'v2_data_test',
    user: process.env.DB_TEST_USER || 'root',
    password: process.env.DB_TEST_PASS || '',
    port: process.env.DB_TEST_PORT || 3306
  }
};

// Seleccionar configuración basada en el entorno
const currentConfig = dbConfigs[NODE_ENV] || dbConfigs.development;

// Crear pool de conexiones
const database = mysql.createPool({
  ...currentConfig,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_POOL_LIMIT || '10'),
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT || '0'),
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

// Manejar eventos del pool
database.on('connection', (connection) => {
  console.log('Nueva conexión establecida en el pool');
});

// manejar que se use solo en desarrolo
// if (process.env.NODE_ENV === 'development') {
//   conexionDB.on('acquire', () => console.log('Conexión adquirida'));
// }

database.on('acquire', (connection) => {
  console.log('Conexión adquirida del pool');
});

database.on('release', (connection) => {
  console.log('Conexión liberada al pool');
});

database.on('error', (err) => {
  console.error('Error en el pool de conexiones:', err);
});

// Función para probar conexión
async function testConnection() {
  let connection;
  try {
    connection = await database.getConnection();
    console.log(`✅ Conexión a la base de datos (${NODE_ENV}) exitosa`);
    await connection.query('SELECT 1');
  } catch (error) {
    console.error(`❌ Error al conectar a la base de datos (${NODE_ENV}):`, error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Función para cerrar el pool adecuadamente
async function closePool() {
  try {
    await database.end();
    console.log('Pool de conexiones cerrado correctamente');
  } catch (error) {
    console.error('Error al cerrar el pool de conexiones:', error);
    throw error;
  }
}

// Exportar la configuración completa
export { 
  database as default, 
  database, 
  testConnection, 
  closePool,
  currentConfig as dbConfig 
};



estructura recomendada
/src/
  ├── config/
  │   ├── database.js    (este archivo)
  │   └── config.js      (configuraciones)
  ├── utils/
  │   └── databaseHelpers.js (funciones adicionales)
  └── models/            (modelos de DB)



Cómo usar en tu aplicación:
Para consultas simples:

javascript
import database from '../config/database.js';

async function getUsers() {
  const [rows] = await database.query('SELECT * FROM users');
  return rows;
}
Para transacciones:

javascript
import database from '../config/database.js';

async function transferFunds(fromId, toId, amount) {
  const conn = await database.getConnection();
  try {
    await conn.beginTransaction();
    
    await conn.query('UPDATE accounts SET balance = balance - ? WHERE id = ?', [amount, fromId]);
    await conn.query('UPDATE accounts SET balance = balance + ? WHERE id = ?', [amount, toId]);
    
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}


Para probar conexión al iniciar:

javascript
import { testConnection } from '../config/database.js';

async function startServer() {
  try {
    await testConnection();
    // Iniciar servidor...
  } catch (error) {
    console.error('No se pudo conectar a la base de datos');
    process.exit(1);
  }
}



------------------------------------------------------------------------
configuracion de Mariano 


import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { REMOTEDBNAME, REMOTEDBPASS, REMOTEHOST, REMOTEDBUSER } from './config.js';

dotenv.config();

// Configuración de las conexiones
const dbConfigRemote = {
  host: REMOTEHOST,
  database: REMOTEDBNAME,
  user: REMOTEDBUSER,
  password: REMOTEDBPASS,
  port: REMOTEDBPORT
};

const dbConfigLocal = {
  host: 'localhost',
  database: 'v2_data',
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
    testConnection(dbConfigRemote, 'v2_data_remote'),
    testConnection(dbConfigLocal, 'v2_data_local')
  ]);
  

}

init();


// Configura la conexión a la base de datos MySQL para v2_data remota
const remote_connection = mysql.createPool({
  ...dbConfigRemote,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Configura la conexión a la base de datos MySQL para v2_data local
const local_connection = mysql.createPool({
  ...dbConfigLocal,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export { local_connection, remote_connection }; //