import nodemailer from 'nodemailer';
import { MAIL, PASSWORD_MAIL } from '../config/config.js';

// --------------------------------- node mailer ----------------------------------
// --------------------------------------------------------------------------------
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: MAIL,
      pass: PASSWORD_MAIL
    }
  });
  
  // Función para enviar el correo
  export const sendMail = async (to, subject, text) => {
    const mailOptions = {
      from: MAIL, 
      to: to, // destinatario
      subject: subject, // asunto
      text: text // contenido del correo
      // html: html, // cuerpo del correo en HTML (opcional)
    };
  
    try {
      // sendMail devuelve una promesa
      const info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado con exito');
      return info;
    } catch (error) {
      console.log('Error al enviar el correo:');
      throw error; // Lanza el error para que sea manejado por quien llame a la función
    }
  };