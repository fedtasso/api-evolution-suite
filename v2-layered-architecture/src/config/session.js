import session from 'express-session';
import { ENVIRONMENT, SESSION_SECRET_PASS } from './config.js';

const sessionConfig = {
  secret: SESSION_SECRET_PASS,
  resave: false,
  saveUninitialized: true
};

if (ENVIRONMENT === 'production') {
  sessionConfig.cookie = {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 30, // 30 minutos
    sameSite: 'strict'
  };
  
  sessionConfig.saveUninitialized = false;
}


export default session(sessionConfig);