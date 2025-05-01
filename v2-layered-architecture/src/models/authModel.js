// Actualizar contraseña
export const putPassword = async (connection, userId, password) => {
  const query = `UPDATE users SET password = ? WHERE id = ?`;
  const [result] = await connection.query(query, [password, userId]);
  return result;
 };

// guardar token para recuperar cuenta
export const tokenRecovery = async (connection, userId, token) => {
  const query = `INSERT INTO password_reset_tokens (userid, token_recovery) VALUES (?, ?)`;
 const [result] = await connection.query(query, [userId, token]);
 return result;
};
