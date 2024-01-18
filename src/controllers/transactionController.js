import { StatusCodes } from "http-status-codes"
import Transaction from "../models/transactionModel.js"

export const createTransaction = async (req, res)=>{
    const {name, amount, category, date, type} = req.body
    const transaction = await Transaction.create({name, amount, category, date, type})
    res.status(201).json({transaction})
}

export const getUserTransaction = async (req, res) =>{
    const transactions = await Transaction.find({})
    res.status(StatusCodes.OK).json(transactions)
}