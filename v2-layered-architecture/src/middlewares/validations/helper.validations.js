import { validationResult } from "express-validator";


export const validationsResponse = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().reduce((acc, error) => {
            acc[error.path] = error.msg;
            return acc;
        }, {});
        return res.status(400).json({ errors: errorMessages });
    }
    next();
};

export const USER_REGEX = {
    name : /^[A-Za-zÁ-ÿ\s]+$/,
    password : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    dni : /^[0-9]{8,10}[A-Za-z]*$/,
    pasaporte : /^[A-Za-z0-9]{6,9}$/, 
    telefono : /^[0-9]+$/, 
    direccion : /^[A-Za-z0-9\s,.-]+$/
}

