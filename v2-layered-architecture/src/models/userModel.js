
// Crear un nuevo usuario en la base de datos local
export const createUser = async (connection, firstName, lastName, password, nationalId, passport, email, phoneNumber, address) => {
   const query = `INSERT INTO users (first_name, last_name, password, national_id, passport, email, phone_number, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const [result] = await connection.query(query, [firstName, lastName, password, nationalId, passport, email, phoneNumber, address]);
  return result.length > 0 ? result.insertId : null;
};

// buscar todos los usuarios en base de dato local
export const findUsersByName = async(connection, firstName, lastName ) => {
    const query = `SELECT id, first_name, last_name, national_id, passport, email, phone_number, address 
      FROM usuarios 
      WHERE first_name LIKE CONCAT('%', ?, '%') 
      OR last_name LIKE CONCAT('%', ?, '%')`;
    const [result] = await connection.query(query, firstName, lastName);    
    return result  
  };

// buscar un usuario por email
export const findUserByEmail = async (connection, email) => {
  const query = `SELECT * FROM users WHERE email = ?`;
  const [result] = await connection.query(query, [email] );
  return result.length > 0 ? result[0] : null;
}; 

// buscar un usuario por id
export const findUserById = async (connection, userId) => {
  const query = `
    SELECT 
      u.*,
      r.id AS role_id,
      r.name AS role_name
    FROM 
      users u
    LEFT JOIN 
      user_roles ur ON u.id = ur.user_id
    LEFT JOIN 
      roles r ON ur.role_id = r.id
    WHERE 
      u.email = ?`;
  const [result] = await connection.query(query, [userId] );
  return result.length > 0 ? result[0] : null;
};


//borrar usuario en tablas relacionadas y luego en tabla principal
export const deleteUserById = async (connection, userId) => {
    const [result] = await connection.query('DELETE FROM users WHERE id = ?', [userId]);
    return result.affectedRows > 0 ? true : false;
};


// actualizar usuario dinamicamente
export const updateUser = async(connection, UpdateInfoUsuario, userId) => {
  const set_clause = Object.entries(UpdateInfoUsuario)
      .map(([clave, _]) => `${clave} = ?`)
      .join(", ");

  const params = Object.values(UpdateInfoUsuario);
  params.push(userId);  // Añade el ID al final para la cláusula WHERE

  const query = `UPDATE users
                SET ${set_clause}
                WHERE id = ?`;

  const [result] = await connection.query(query, params);
  return result.affectedRows > 0 ? true : null;
};
