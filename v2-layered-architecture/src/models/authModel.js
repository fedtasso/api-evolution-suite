// Actualizar contraseña
export const putPassword = async (conn, userId, password) => {
  const query = `UPDATE users SET password = ? WHERE id = ?`;
  const [result] = await conn.query(query, [password, userId]);
  return result;
 };

// guardar token para recuperar cuenta
export const tokenRecovery = async (conn, userId, token) => {
 const query = `INSERT INTO password_reset_tokens (user_id, token_recovery) VALUES (?, ?)`;
 const [result] = await conn.query(query, [userId, token]);
 return result;
};

// marcar token como usado
export const markUsedToken = async (conn, userId, token) => {
  const query = `  UPDATE password_reset_tokens 
  SET is_used = TRUE, used_at = CURRENT_TIMESTAMP
  WHERE user_id = ? AND token_recovery = ? AND is_used = FALSE`;
  const [result] = await conn.query(query, [userId, token])
 return result;
};