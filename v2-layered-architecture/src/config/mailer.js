import nodemailer from 'nodemailer';
import { MAIL, PASSWORD_MAIL } from '../config/config.js';


const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: MAIL,
      pass: PASSWORD_MAIL
    }
  });

export default mailTransporter