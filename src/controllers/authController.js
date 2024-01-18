import { StatusCodes } from "http-status-codes"
import User from "../models/authModel.js"
import bcrypt from 'bcrypt'
import { hashPassword } from "../utils/bcrypt.js"


export const registerUser = async(req, res)=>{
    const {name, email, goal, profileImg, password} = req.body
    const hashedPassword =  hashPassword(password)
    const user = await User.create({name, email, goal, profileImg, hashedPassword})
    res.status(201).json({user})
}
