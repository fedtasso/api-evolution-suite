// Dentro de src/, no dentro de utils/.
// Por qué:

// utils/ es para utilidades genéricas (ej: formatear fechas, logger).

// emails/ es un módulo específico (como users/ o products/), no una utilidad.

// Estructura Óptima
// bash
// src/
// ├── emails/          # Todo el código relacionado con correos
// │   ├── services/    # Lógica de envío (sendMail, sendWelcomeEmail)
// │   ├── templates/   # Plantillas HTML
// │   └── helpers/     # Funciones auxiliares (compilar templates, etc.)
// ├── utils/           # Utilidades transversales (logger, validators)
// └── config/          # Configuraciones (mailTransporter, JWT, DB)


// Diferencias Clave
// Carpeta	Contenido Típico	¿Dónde poner emails/?
// utils/	Código reutilizable genérico (logger, formateadores).	❌ No. El correo es un dominio específico.
// src/	Módulos de negocio (users, emails, payments).	✅ Sí. Es un módulo propio, no una utilidad.
// Ejemplo Práctico
// 1. Estructura Correcta
// bash
// src/
// ├── emails/
// │   ├── services/mailer.service.js     # sendMail, sendWelcomeEmail
// │   └── templates/welcome.html         # HTML con {{name}}
// └── utils/logger.js                    # Logger genérico
// 2. ¿Cómo se Usa?
// javascript
// // Desde un controlador (ej: authController.js):
// import { sendWelcomeEmail } from '../emails/services/mailer.service.js';

// await sendWelcomeEmail({ name: 'Juan', email: 'juan@test.com' });
// Beneficios de Esta Estructura
// Claridad:

// Todo lo relacionado con correos está en un solo lugar.

// No se mezcla con utilidades genéricas.

// Escalabilidad:

// Si añades notificaciones por SMS o WhatsApp, crearías src/notifications/.

// Testing Fácil:

// Puedes mockear todo el módulo emails/ en pruebas.

// Alternativas Comunes (y por qué evitarlas)
// utils/emails/:

// ❌ Confunde el propósito de utils/.

// ❌ Difícil de escalar si el módulo crece.

// services/mailer.js:

// ✅ Mejor que utils/, pero sigue siendo menos organizado que emails/.

// Conclusión
// Usa src/emails/ si:

// El correo es una parte importante de tu app.

// Tienes múltiples plantillas o servicios de envío.

// Usa utils/mailer.js solo si:

// Es un proyecto pequeño y el correo es una funcionalidad menor.





// 🗂️ Estructura Recomendada
// bash
// src/
// ├── config/
// │   └── mail.config.js      # Configuración del transporte (nodemailer)
// ├── emails/                 # Carpeta dedicada a todo lo relacionado con emails
// │   ├── services/           # Servicios de envío (sendMail, sendWelcomeEmail, etc.)
// │   │   └── mailer.service.js
// │   ├── templates/          # Plantillas HTML o texto
// │   │   ├── welcome.html
// │   │   └── reset-password.html
// │   └── helpers/            # Funciones auxiliares (opcional)
// │       └── template.helper.js
// └── utils/                  # Utilidades generales (no específicas de correo)
//     └── logger.js
// ¿Por qué esta estructura?
// Separación clara de responsabilidades:

// emails/ agrupa todo lo relacionado con correos (servicios, plantillas, helpers).

// config/ mantiene la configuración técnica (credenciales, transporte).

// utils/ se reserva para código transversal (logger, formateadores, etc.).

// Escalabilidad:

// Si añades nuevos tipos de correos (ej: notificaciones, promociones), todo está en un lugar lógico.

// Las plantillas se organizan en archivos HTML independientes, facilitando su edición.

// Mantenibilidad:

// Cambiar una plantilla no afecta al servicio de envío.

// Los servicios de correo (mailer.service.js) pueden reutilizarse en múltiples controladores.

// Ejemplo de Archivos
// 1. emails/services/mailer.service.js
// javascript
// import { mailTransporter } from '../../config/mail.config.js';
// import { compileWelcomeTemplate } from '../helpers/template.helper.js';
// import logger from '../../utils/logger.js';

// export const sendMail = async ({ to, subject, text, html }) => {
//   try {
//     await mailTransporter.sendMail({
//       from: '"App Name" <no-reply@example.com>',
//       to,
//       subject,
//       text,
//       html,
//     });
//     logger.info(`Correo enviado a ${to}`);
//   } catch (error) {
//     logger.error(`Error enviando correo a ${to}: ${error.message}`);
//     throw error;
//   }
// };

// export const sendWelcomeEmail = async (user) => {
//   const html = compileWelcomeTemplate(user.name);
//   return sendMail({
//     to: user.email,
//     subject: 'Bienvenido a nuestra plataforma',
//     html,
//   });
// };
// 2. emails/templates/welcome.html
// html
// <!DOCTYPE html>
// <html>
// <body>
//   <h1>¡Bienvenido, {{name}}! 🎉</h1>
//   <p>Gracias por unirte a nuestra app.</p>
// </body>
// </html>
// 3. emails/helpers/template.helper.js (ejemplo con Handlebars)
// javascript
// import fs from 'fs';
// import handlebars from 'handlebars';

// export const compileWelcomeTemplate = (name) => {
//   const templateFile = fs.readFileSync('./src/emails/templates/welcome.html', 'utf-8');
//   const template = handlebars.compile(templateFile);
//   return template({ name });
// };
// Alternativas Comunes
// Opción 1: Todo en utils/ (para proyectos pequeños)
// bash
// utils/
// ├── mailer.js           # Funciones de envío
// └── templates/          # Plantillas
//     └── welcome.html
// Ventaja: Simple y rápido.

// Desventaja: Se desordena si el módulo de correo crece.