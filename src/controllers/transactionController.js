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
    try {
        const token = req.params.token
    const userId = await verifyJWT(token)
    if(!userId || !userId._id){
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
    }
    const user = await User.findById(userId._id)
    if(!user){
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
    }
    const transactions = await Transaction.find({uid:userId._id, archived: false}).lean() 

    const sanitizedTransactions = transactions.map(({ uid, archived, ...rest }) => rest);

    res.status(StatusCodes.OK).json(sanitizedTransactions)
        
    } catch (error) {
        console.log("Get Transaction Error:", error)
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
    }
}

export const updateTransaction = async (req, res)=>{

    try {
       const {_id, ...rest} = req.body
       const token = req.params.token
       const userId = await verifyJWT(token)
       if(!userId && !userId._id){
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
       }
       const user = await User.findById(userId._id)
       if(!user){
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
       }
       const transaction = await Transaction.findById(_id);
       if(!transaction){
          return res.status(StatusCodes.NOT_FOUND).json({message: "Transaction cannot be updated!"})
       }  
       const updatedTransaction = await Transaction.findOneAndUpdate(
          {_id:_id},
          rest,
          { new: true })
          res.status(StatusCodes.OK).json({message: 'Successfully updated', updatedTransaction}
        )
    } catch (error) {
        console.log("UpdateTransaction Error:", error)
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
    }
    
}

export const archiveTransaction = async (req, res) =>{
    try{
      const {_id} = req.body
         const token = req.params.token
         const userId = await verifyJWT(token)
         if(!userId && !userId._id){
          return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
         }
         const user = await User.findById(userId._id)
         if(!user){
          return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
         }
         const transaction = await Transaction.findById(_id);
         if(!transaction){
            return res.status(StatusCodes.NOT_FOUND).json({message: "Transaction cannot be deleted!"})
         }  
          await Transaction.findOneAndUpdate(
            {_id:_id},
            {$set: { archived: true }},
            { new: true })
            res.status(StatusCodes.OK).json({message: 'Successfully deleted'}
          )
    } catch {
          console.log("UpdateTransaction Error:", error)
          return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
    }
  }