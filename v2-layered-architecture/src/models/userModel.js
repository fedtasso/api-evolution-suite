
// Crear un nuevo usuario en la base de datos local
export const createUser = async (conexion, nombre, apellido, password, dni, pasaporte, email, telefono, direccion) => {
   const query = `INSERT INTO usuarios (nombre, apellido, password, dni, pasaporte, email, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const [result] = await conexion.query(query, [nombre, apellido, password, dni, pasaporte, email, telefono, direccion]);
  return result;
};

// buscar todos los usuarios en base de dato local
export const findUsers = async(conexion ) => {
    const query = `SELECT id, nombre, apellido, dni, pasaporte, email, telefono, direccion FROM usuarios`;
    const [result] = await conexion.query(query);    
    return result  
  };

// buscar un usuario por email
export const consultarUsuarioPorEmail = async (conexion, email) => {
  const query = `SELECT * FROM usuarios WHERE email = ?`;
  const [result] = await conexion.query(query, [email] );
  return result.length > 0 ? result[0] : null;
}; 

// buscar un usuario por id
export const consultarUsuarioPorID = async (conexion, usuario_id) => {
  const query = `SELECT * FROM usuarios WHERE id = ?`;
  const [result] = await conexion.query(query, [usuario_id] );
  return result.length > 0 ? result[0] : null;
};


//borrar usuario en tablas relacionadas y luego en tabla principal
export const deleteUserByID = async (conexion, usuario_id) => {
  try {
    //borrar usuario en tablas relacionadas
    await conexion.query('DELETE FROM token_recovery WHERE usuario_id = ?', [usuario_id]);
   
    //borrar usuario en tabla principal
    const [result] = await conexion.query('DELETE FROM usuarios WHERE id = ?', [usuario_id]);
    return result.affectedRows > 0 ? true : false;
  } catch (error) {   
    throw new Error("Error al borrar el usuario");
  }
};


// actualizar usuario dinamicamente
export const updateUser = async(conexion, UpdateInfoUsuario, usuario_id) => {
  const set_clause = Object.entries(UpdateInfoUsuario)
      .map(([clave, _]) => `${clave} = ?`)
      .join(", ");

  const params = Object.values(UpdateInfoUsuario);
  params.push(usuario_id);  // Añade el ID al final para la cláusula WHERE

  const query = `UPDATE usuarios
                SET ${set_clause}
                WHERE id = ?`;

  const [result] = await conexion.query(query, params);
  return result.affectedRows > 0 ? true : null;
};
