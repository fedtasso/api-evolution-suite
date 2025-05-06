import session from 'express-session';
import { ENVIROMENT, SESSION_SECRET_PASS } from './config';

const sessionConfig = {
  secret: SESSION_SECRET_PASS,
  resave: false,
  saveUninitialized: true
};

if (ENVIROMENT === 'production') {
  sessionConfig.cookie = {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 30, // 30 minutos
    sameSite: 'strict'
  };
  sessionConfig.saveUninitialized = false;
}


export default sessionConfig;