import jwt from "jsonwebtoken";

export const createJWT =(payload, )=>{
    return jwt.sign(payload, 'spendWise')
}