import express from 'express';
import { httpLogoutUser, loginUser, recoveryPasswordEmail, recoveryPasswordReset, updatePassword } from '../controller/authController.js';
import { isAuthenticated } from '../middlewares/authMiddelware.js';
import { validateLogin, validateRecoveryEmail, validateRecoveryPassword, validateUpdatePassword } from '../middlewares/validations/authValidations.js';

const router = express.Router();

// Endpoints para usuarios
router.post('/user/login', validateLogin, loginUser); //
router.post('/user/logout', isAuthenticated, httpLogoutUser);
router.put('/user/update-password', isAuthenticated, validateUpdatePassword, updatePassword);
router.put('/user/recovery-password/email', validateRecoveryEmail, recoveryPasswordEmail);
router.post('/user/recovery-password/reset/:token', validateRecoveryPassword, recoveryPasswordReset);

export default router;