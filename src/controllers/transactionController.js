import Transaction from "../models/transactionModel.js"


export const createTransaction = async (req, res)=>{
    const {name, amount, category, date, type} = req.body
    const transaction = await Transaction.create({name, amount, category, date, type})
    res.status(201).json({transaction})
}