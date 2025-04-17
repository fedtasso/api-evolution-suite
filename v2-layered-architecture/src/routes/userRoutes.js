import express from 'express';
import { registerUser, getUser, getUserByID, deleteUSer, putUSer } from '../controller/userController.js';
import { isAuthenticated } from '../middlewares/authMiddelware.js';
import { validarPost, validarUsuarioGeneral, validarId } from '../middlewares/validations/userValidations.js';

const router = express.Router();

// Endpoints para usuarios
router.post('/usuario', validarPost, registerUser); // req.body
router.get('/usuarios', getUser); // req.query
router.get('/usuario/:id', validarId, getUserByID); //req.params
router.delete('/usuario', isAuthenticated, deleteUSer); // req.cookies
router.put('/usuario', validarUsuarioGeneral, isAuthenticated, putUSer); //req.body

export default router;