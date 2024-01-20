import { StatusCodes } from "http-status-codes"
import Transaction from "../models/transactionModel.js"
import User from '../models/authModel.js'
import { verifyJWT } from "../utils/tokenUtils.js"

export const createTransaction = async (req, res)=>{
    const {name, amount, category, date, type} = req.body
    const token = req.params.token
    const userId = await verifyJWT(token) 
    if(!userId && !userId._id){
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
    }
    const user = await User.findById(userId._id)
    if(!user){
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
    }
    const transaction = await Transaction.create({name, amount, category, date, type, uid:userId._id })
    res.status(201).json({transaction})
}

export const getUserTransaction = async (req, res) =>{
    const token= req.params.token
    const userId = await verifyJWT(token)
    if(!userId && !userId._id){
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
    }
    const transactions = await Transaction.find({uid:userId._id})
    res.status(StatusCodes.OK).json(transactions)
}