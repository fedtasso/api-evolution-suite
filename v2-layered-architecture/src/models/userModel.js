
// Crear un nuevo usuario en la base de datos local
export const createUser = async (conn, firstName, lastName, password, nationalId, passport, email, phoneNumber, address) => {
  const query = `INSERT INTO users (first_name, last_name, password, national_id, passport, email, phone_number, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const [result] = await conn.query(query, [firstName, lastName, password, nationalId, passport, email, phoneNumber, address]);
  return result.affectedRows > 0 ? result.insertId : null;
};

// asignar rol a usuario

export const assignedRole = async (conn, userId, role) => {
  const query = `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`;
  const [result] = await conn.query(query, [userId, role]);
  return result.affectedRows > 0 ? result.insertId : null;
}

// buscar todos los usuarios en base de dato local
export const findUsersByName = async(conn, firstName, lastName ) => {
    const query = `SELECT id, first_name, last_name, national_id, passport, email, phone_number, address 
      FROM usuarios 
      WHERE first_name LIKE CONCAT('%', ?, '%') 
      OR last_name LIKE CONCAT('%', ?, '%')`;
    const [result] = await conn.query(query, firstName, lastName);   
    return result  
  };
  
  // buscar un usuario por email
  export const findUserByEmail = async (conn, email) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    const [result] = await conn.query(query, [email] );
    return result.length > 0 ? result[0] : null;
  }; 
  
  // buscar un usuario por id
  export const findUserById = async (conn, userId) => {
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
    u.id = ?`;
    const [result] = await conn.query(query, [userId] );
  return result.length > 0 ? result[0] : null;
};


//borrar usuario en tablas relacionadas y luego en tabla principal
export const deleteUserById = async (conn, userId) => {
    const [result] = await conn.query('DELETE FROM users WHERE id = ?', [userId]);
    return result.affectedRows > 0 ? true : false;
};


// actualizar usuario dinamicamente
export const updateUser = async(conn, UpdateInfoUsuario, userId) => {
  const set_clause = Object.entries(UpdateInfoUsuario)
      .map(([clave, _]) => `${clave} = ?`)
      .join(", ");

  const params = Object.values(UpdateInfoUsuario);
  params.push(userId);  // Añade el ID al final para la cláusula WHERE

  const query = `UPDATE users
                SET ${set_clause}
                WHERE id = ?`;

  const [result] = await conn.query(query, params);
  return result.affectedRows > 0 ? true : null;
};
