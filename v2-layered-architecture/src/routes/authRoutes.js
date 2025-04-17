// login con google
// login con facebook

import express from 'express';
import { loginUser, logoutUser, recoveryPasswordEmail, recoveryPasswordReset, updatePassword } from '../controller/authController.js';
import { isAuthenticated } from '../middlewares/authMiddelware.js';
import { validarUsuarioGeneral } from '../middlewares/validations/userValidations.js';
import { validarLogin, validarRecoveryEmail, validarRecoveryPassword, validarUpdatePassword } from '../middlewares/validations/authValidations.js';

const router = express.Router();

// Endpoints para usuarios
router.post('/login',validarLogin, loginUser); //
router.post('/logout', logoutUser);
router.put('/actualizar-password', isAuthenticated, validarUpdatePassword, updatePassword);
router.post('/recuperar-password/email',validarRecoveryEmail, recoveryPasswordEmail);
router.post('/recuperar-password/reset/:token',validarRecoveryPassword, recoveryPasswordReset);

export default router;