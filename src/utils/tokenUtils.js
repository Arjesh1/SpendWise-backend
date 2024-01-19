import jwt from "jsonwebtoken";

export const createJWT =(payload, )=>{
    return jwt.sign(payload, process.env.JWT_SECRET_KEY)
}