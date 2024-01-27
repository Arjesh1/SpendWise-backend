import { body, param, validationResult } from "express-validator";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";
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
    body('name').notEmpty().withMessage('Name is required!'),
    body('amount').notEmpty().withMessage('Amount is required!'),
    body('date').notEmpty().withMessage('Date is required!'),
    body('type').notEmpty().isIn(Object.values(TRANSACTION_TYPE)).withMessage('Invalid transaction type!'),
    body('category').optional().isIn(Object.values(TRANSACTION_CATEGORY)).withMessage('Invalid transaction category!')
])

export const validateRegisterAuthValues = withValidationError([
    body('name').notEmpty().withMessage('Name is required!'),
    body('email').notEmpty().isEmail().withMessage('Email is invalid!'),
    body('password').notEmpty().withMessage('Password is required!'),
    body('goal').optional(),
    body('profileImg').optional(),

])

export const validateLoginAuthValues = withValidationError([
    body('email').notEmpty().isEmail().withMessage('Email is invalid!'),
    body('password').notEmpty().withMessage('Password is required!'),
])


