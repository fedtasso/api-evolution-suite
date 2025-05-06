import { validationResult } from "express-validator";


export const validationsResponse = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().reduce((acc, error) => {
            acc[error.path] = error.msg;
            return acc;
        }, {});
        return res.status(400).json({ success: false, errors: errorMessages, status: 400 });
    }
    next();
};

export const USER_REGEX = {
    name : /^[A-Za-zÁ-ÿ\s]+$/,
    password : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    nationalId : /^[0-9]{8,10}[A-Za-z]*$/,
    passport : /^[A-Za-z0-9]{6,9}$/, 
    phoneNumber : /^[0-9]+$/, 
    address : /^[A-Za-z0-9\s,.-]+$/
}

