import { check, param} from 'express-validator';
import { USER_REGEX, validationsResponse } from './helper.validations.js';


// Middleware de validación general de usuario
export const validarUsuarioGeneral = [
    check('nombre')
        .trim()
        .optional()
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
        .matches(USER_REGEX.name).withMessage('El nombre solo puede contener letras y espacios'),

    check('apellido')
        .trim()
        .optional()
        .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres')
        .matches(USER_REGEX.name).withMessage('El apellido solo puede contener letras y espacios'),

    check('password')
        .optional()
        .matches(USER_REGEX.password)
        .withMessage('La contraseña debe tener entre 8 y 20 caracteres, e incluir una minúscula, una mayúscula, un número y un caracter especial (@$!%*?&)'),

    check('dni')
        .optional()
        .matches(USER_REGEX.dni).withMessage('El DNI debe contener solo dígitos y opcionalmente una letra'),

    check('pasaporte')
        .optional()
        .matches(USER_REGEX.pasaporte).withMessage('El pasaporte debe tener entre 6 y 9 caracteres alfanuméricos'),
    
    check('email')
        .optional()
        .isEmail().withMessage('El correo electrónico debe ser válido'),

    check('telefono')
        .optional()
        .isLength({ min: 8, max: 15 }).withMessage('El teléfono debe tener entre 8 y 15 dígitos')
        .matches(USER_REGEX.telefono).withMessage('El teléfono debe contener solo números'),

    check('direccion')
        .trim()
        .optional()
        .isLength({ min: 5, max: 100 }).withMessage('La dirección debe tener entre 5 y 100 caracteres')
        .matches(USER_REGEX.direccion).withMessage('La dirección solo puede contener letras, números, espacios y los siguientes signos de puntuación: ,.-'),
    
    validationsResponse
];


// Middleware de validación para registro de usuario
export const validarPost = [
    check('nombre')
        .notEmpty().withMessage('El campo nombre es obligatorio'),
        
    check('apellido')
        .notEmpty().withMessage('El campo apellido es obligatorio'),

    check('password')
        .notEmpty().withMessage('El campo contraseña es obligatorio'),

    check(['dni', 'pasaporte']).custom((value, { req }) => {
        if (!req.body.dni && !req.body.pasaporte) {
            throw new Error('Debe proporcionar al menos un DNI o un pasaporte');
        }
        return true;
    }),
    
    check('email')
        .notEmpty().withMessage('El campo email es obligatorio'),
    
    validationsResponse,
    
    ...validarUsuarioGeneral
    
        
];


// Middelware de validacion de id
export const validarId = [
    param('id')
        .isInt({ min: 1 }).withMessage('El ID de usuario debe ser un número entero mayor a 0'),

    validationsResponse
]