import {StatusCodes} from 'http-status-codes'

export class NotFoundError extends Error{
    constructor(message){
        super(message)
        this.name = 'NotFoundError';
        this.StatusCode =  StatusCodes.NOT_FOUND
    }
}

export class BadRequestError extends Error{
    constructor(message){
        super(message)
        this.name = 'BadRequestError';
        this.StatusCode =  StatusCodes.BAD_REQUEST
    }
}

export class UnAuthencitatedError extends Error{
    constructor(message){
        super(message)
        this.name = 'UnAuthencitatedError';
        this.StatusCode =  StatusCodes.UNAUTHORIZED
    }
}

export class UnauthorizedError extends Error{
    constructor(message){
        super(message)
        this.name = 'UnauthorizedError';
        this.StatusCode =  StatusCodes.FORBIDDEN
    }
}