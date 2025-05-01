// ¿Para qué sirve la carpeta response?
// Objetivo principal:
// Mantener un formato consistente en todas las respuestas de tu API (éxito, errores, validaciones, etc.).

// Beneficios:

// Consistencia: Todas las respuestas siguen la misma estructura (ej: { success, data, error }).

// Reutilización: Evita repetir código en cada controlador.

// Mantenibilidad: Cambios en el formato se aplican en un solo lugar.

// Ejemplo de Estructura
// /src
//   /responses  # o /utils/responses
//     success.js
//     error.js
//     index.js  # Exporta todos los métodos
// Archivos típicos y su contenido:
// 1. success.js (Respuestas exitosas):
// javascript
// // Ejemplo para respuesta exitosa (200 OK)
// const successResponse = (res, data = null, message = 'Operación exitosa', status = 200) => {
//   return res.status(status).json({
//     success: true,
//     message,
//     data,  // Datos de la respuesta (opcional)
//   });
// };

// module.exports = successResponse;
// 2. error.js (Respuestas de error):
// javascript
// // Ejemplo para errores (400, 401, 404, 500...)
// const errorResponse = (res, error = null, message = 'Error en la solicitud', status = 400) => {
//   return res.status(status).json({
//     success: false,
//     message,
//     error: error?.message || error,  // Detalles técnicos (opcional)
//     code: error?.code || 'GENERIC_ERROR',  // Código interno
//   });
// };

// module.exports = errorResponse;
// 3. index.js (Exportación centralizada):
// javascript
// const successResponse = require('./success');
// const errorResponse = require('./error');

// module.exports = {
//   success: successResponse,
//   error: errorResponse,
// };
// ¿Cómo se usa en los controladores?
// javascript
// import { success, error } from '../responses';  // Ajusta la ruta según tu proyecto

// export const getUser = async (req, res) => {
//   try {
//     const user = await UserService.findById(req.params.id);
//     if (!user) {
//       return error(res, null, 'Usuario no encontrado', 404);
//     }
//     success(res, user, 'Usuario obtenido');
//   } catch (err) {
//     error(res, err, 'Error al buscar usuario', 500);
//   }
// };
// Ejemplo de respuestas generadas
// Éxito (200 OK):

// json
// {
//   "success": true,
//   "message": "Usuario obtenido",
//   "data": { "id": 1, "name": "Juan" }
// }
// Error (404 Not Found):

// json
// {
//   "success": false,
//   "message": "Usuario no encontrado",
//   "error": null,
//   "code": "GENERIC_ERROR"
// }
// ¿Por qué no usarla directamente en los controladores?
// Sin response (menos mantenible):

// javascript
// // Sin la carpeta response (repetitivo)
// res.status(200).json({ success: true, data: user });
// res.status(404).json({ success: false, message: 'No encontrado' });
// Con response (más limpio):

// javascript
// success(res, user);
// error(res, null, 'No encontrado', 404);
// Casos de uso avanzados
// Paginación:

// javascript
// success(res, { data: users, pagination: { page: 1, total: 100 } });
// Errores personalizados:

// javascript
// error(res, { code: 'INVALID_PASSWORD' }, 'Contraseña incorrecta', 401);
// ¿Es obligatoria esta carpeta?
// No, pero es una buena práctica en proyectos medianos/grandes. Alternativas:

// Middleware de respuesta:
// Configurar un middleware que agregue métodos a res (ej: res.success()).

// Clases de respuesta:
// Usar OOP con clases como ApiResponse o ApiError.