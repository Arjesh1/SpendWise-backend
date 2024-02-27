import { body, validationResult, header } from "express-validator";
import { RESPONSE_MESSAGES, TRANSACTION_CATEGORY, TRANSACTION_TYPE } from "../utils/constants.js";
import { StatusCodes } from "http-status-codes";

const withValidationError = (validateValues)=>{
    return [
        validateValues, 
        (req, res, next) =>{
            const errors =  validationResult(req)
            if(!errors.isEmpty()){
                return res.status(StatusCodes.BAD_REQUEST).json({message: RESPONSE_MESSAGES.InputEmptyMessage})
            }
            next()
        }
    ]
}

export const validateTransactionValues = withValidationError([
    header('authorization').notEmpty().escape().withMessage('JWT is required'),
    body('name').notEmpty().escape().withMessage('Name is required!'),
    body('amount').notEmpty().escape().withMessage('Amount is required!'),
    body('date').notEmpty().escape().withMessage('Date is required!'),
    body('type').notEmpty().isIn(Object.values(TRANSACTION_TYPE)).escape().withMessage('Invalid transaction type!'),
    body('category').optional().isIn(Object.values(TRANSACTION_CATEGORY)).escape().withMessage('Invalid transaction category!')
])

export const validateTransactionId = withValidationError([
    header('authorization').notEmpty().escape().withMessage('JWT is required'),
    body('_id').notEmpty().escape().withMessage('Id is required!'),
])

export const validateUserGetTransaction = withValidationError([
    header('authorization').notEmpty().escape().withMessage('JWT is required')
])

export const validateRegisterAuthValues = withValidationError([
    body('name').notEmpty().escape().withMessage('Name is required!'),
    body('email').notEmpty().isEmail().escape().withMessage('Email is invalid!'),
    body('password').notEmpty().escape().withMessage('Password is required!'),
    body('confirmPassword').notEmpty().escape().withMessage('Confirm password is required!'),
    body('goal').optional(),
    body('profileImg').optional(),

])

export const validateLoginAuthValues = withValidationError([
    body('email').notEmpty().isEmail().escape().withMessage('Email is invalid!'),
    body('password').notEmpty().escape().withMessage('Password is required!'),
])

export const validateUpdateAuthValues = withValidationError([
    header('authorization').notEmpty().escape().withMessage('JWT is required'),
    body('name').notEmpty().escape().withMessage('Name is required!'),
    body('email').notEmpty().isEmail().escape().withMessage('Email is invalid!'),
    body('goal').optional(),
    body('profileImg').optional(),
])

export const validateChangePasswordValues = withValidationError([
    header('authorization').notEmpty().escape().withMessage('JWT is required'),
    body('confirmNewPassword').notEmpty().escape().withMessage('Confirm password is required!'),
    body('oldPassword').notEmpty().isEmail().escape().withMessage('Old password is required!'),
    body('newPassword').notEmpty().isEmail().escape().withMessage('New password is required!'),
])

export const validateResetPassword = withValidationError([
    body('email').notEmpty().isEmail().escape().withMessage('Email is invalid!'),
])

export const validateOtp = withValidationError([
    body('email').notEmpty().isEmail().escape().withMessage('Email is invalid!'),
    body('code').notEmpty().escape().withMessage('OTP is invalid!'),
])

export const validateNewResetPassword = withValidationError([
    body('email').notEmpty().isEmail().escape().withMessage('Email is invalid!'),
    body('code').notEmpty().escape().withMessage('OTP is invalid!'),
    body('confirmPassword').notEmpty().escape().withMessage('Confirm password is required!'),
    body('password').notEmpty().isEmail().escape().withMessage('Password is required!')
])


