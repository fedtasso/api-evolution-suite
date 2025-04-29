import { MAIL } from "../config/config";
import mailTransporter from "../config/mailer";

  
  // Función para enviar el correo
  export const sendMail = async (to, subject, text) => {
    const mailOptions = {
      from: `apiV2-LayeredArchitecture <${MAIL}>`, 
      to,
      subject,
      text,
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