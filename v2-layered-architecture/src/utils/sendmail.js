import { MAIL, ROOT_PATH } from "../config/config.js";
import mailTransporter from "../config/mailer.js";

  
  // Función para enviar el correo
  export const sendMail = async (to, subject, html) => {
    const mailOptions = {
      from: `apiV2-LayeredArchitecture <${MAIL}>`, 
      to,
      subject,
      html
    };
  
    try {
      // sendMail devuelve una promesa
      const info = await mailTransporter.sendMail(mailOptions);
      console.log('Correo enviado con exito');
      return info;
    } catch (error) {
      console.log('Error al enviar el correo:');
      throw error; // Lanza el error para que sea manejado por quien llame a la función
    }
  };



  // respuestas html

  export const emailCreatUser = (firstName, lastName, email) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2c3e50;">¡Bienvenido/a a nuestra plataforma!</h2>
    <p>Hola ${firstName} ${lastName},</p>
    <p>Nos complace informarte que tu cuenta ha sido creada exitosamente.</p>
    <p>A continuación, tus detalles de registro:</p>
    <ul>
      <li><strong>Nombre completo:</strong> ${firstName} ${lastName}</li>
      <li><strong>Correo electrónico:</strong> ${email}</li>
    </ul>
    <p>Si no realizaste esta acción, por favor contacta a nuestro equipo de soporte.</p>
    <p style="margin-top: 30px; font-size: 0.9em; color: #7f8c8d;">
      Atentamente,<br>
      El equipo de V2 API Layered Architecture
    </p>
  </div>`


  export const emailPasswordRecovery = (firstName, lastName, token) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2c3e50;">Recuperación de contraseña</h2>
    <p>Hola ${firstName} ${lastName},</p>
    <p>Nos comunicamos desde nuestra API Layered Architecture porque hemos recibido una solicitud para recuperar tu contraseña.</p>
    <p>Por favor, haz clic en el botón a continuación para restablecer tu contraseña:</p>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${ROOT_PATH}/v2/layered-architecture/user/recovery-password/reset/${token}" 
         style="background-color: #3498db; color: white; padding: 12px 20px; 
                text-decoration: none; border-radius: 4px; font-weight: bold;">
        Restablecer contraseña
      </a>
    </div>

    <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
    <p style="word-break: break-all; color: #3498db;">${ROOT_PATH}/v2/layered-architecture/user/recovery-password/reset/${token}</p>
    
    <p style="font-size: 0.9em; color: #7f8c8d;">
      Si no solicitaste recuperar tu contraseña, por favor ignora este correo.
    </p>
    
    <p style="margin-top: 30px; font-size: 0.9em; color: #7f8c8d;">
      Atentamente,<br>
      El equipo de V2 API Layered Architecture
    </p>
  </div>`