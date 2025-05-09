import { check } from 'express-validator';
import { USER_REGEX, validationsResponse } from './helperValidations.js';
import { baseUserValidations } from './userValidations.js';



// Middleware de validación para login de usuario
export const validateLogin = [
    check('email')
        .notEmpty().withMessage('El campo email es obligatorio'),
    check('password')
        .notEmpty().withMessage('El campo contraseña es obligatorio'),
    validationsResponse,
    ...baseUserValidations
];


// Middleware de validación para actualizar password de usuario
const validarPassword = (campo) => 
    check(campo)
        .notEmpty().withMessage(`El campo ${campo} es obligatorio`)
        .matches(USER_REGEX.password)
        .withMessage('La contraseña debe tener entre 8 y 20 caracteres, e incluir una minúscula, una mayúscula, un número y un caracter especial (@$!%*?&)');

export const validateUpdatePassword = [
    validarPassword('oldPassword'),
    validarPassword('newPassword'),
    validationsResponse,
    ...baseUserValidations
];


// Middleware de validación para login de usuario
export const validateRecoveryEmail = [
    check('email')
        .notEmpty().withMessage('El campo email es obligatorio'),
    validationsResponse,
    ...baseUserValidations
];


// Middleware de validación para login de usuario
export const validateRecoveryPassword = [
    check('password')
        .notEmpty().withMessage('El campo contraseña es obligatorio'),
    validationsResponse,
    ...baseUserValidations
];