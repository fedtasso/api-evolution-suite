// Actualizar contraseña
export const putPassword = async (conexion, userId, password) => {
  const query = `UPDATE usuarios SET password = ? WHERE id = ?`;
  const [result] = await conexion.query(query, [password, userId]);
  return result;
 };

// guardar token para recuperar cuenta
export const token_recovery = async (conexion, usuario_id, user_token_recovery) => {
  const query = `INSERT INTO token_recovery (usuario_id, user_token_recovery) VALUES (?, ?)`;
 const [result] = await conexion.query(query, [usuario_id, user_token_recovery]);
 return result;
};