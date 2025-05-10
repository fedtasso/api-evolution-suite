import express from 'express';
import { baseUserValidations, validateId, validateUserCreation } from '../middlewares/validations/userValidations.js';
import { deleteUSer, getUser, getUserByID, putUser, registerUser } from '../controller/userController.js';
import { isAuthenticated } from '../middlewares/authMiddelware.js';

const router = express.Router();

// Endpoints para usuarios
router.post('/user', validateUserCreation, registerUser); // req.body
router.get('/user', isAuthenticated, getUser); // req.query
router.get('/user/:id', validateId, getUserByID); //req.params
router.delete('/user', isAuthenticated, deleteUSer); // req.cookies
router.put('/user',baseUserValidations, isAuthenticated, putUser); //req.body

export default router;