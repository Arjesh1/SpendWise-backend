import jwt from "jsonwebtoken";

export const createJWT =(payload)=>{
    return jwt.sign(payload, process.env.JWT_SECRET_KEY)
}

export const verifyJWT = (token) =>{
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decoded;
    } catch (error) {
        return error.message.includes("jwt expired")
          ? "jwt expired"
          : error.message;
    }
}