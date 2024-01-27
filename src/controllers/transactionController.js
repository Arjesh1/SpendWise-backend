import { StatusCodes } from "http-status-codes"
import Transaction from "../models/transactionModel.js"
import User from '../models/authModel.js'
import { verifyJWT } from "../utils/tokenUtils.js"

export const createTransaction = async (req, res)=>{
    try {
        const token = await req.headers.authorization;
        const userId = await verifyJWT(token) 
        if(!userId || !userId._id){
           return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
        }
        const user = await User.findById(userId._id)
        if(!user){
           return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
        }
        await Transaction.create({...req.body, uid:userId._id })
        return res.status(StatusCodes.OK).json({success: 'Transaction has been added.'})
    } catch (error) {
        console.log("Add Transaction Error:", error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Something went wrong. Please try again later."})
    }
}

export const getUserTransaction = async (req, res) =>{
    try {
    const token = req.headers.authorization;
    if(!token) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
    }
    const userId = await verifyJWT(token)
    if(!userId || !userId._id){
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
    }
    const user = await User.findById(userId._id)
    if(!user){
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
    }
    const transactions = await Transaction.find({uid:userId._id, archived: false}).lean() 
    const sanitizedTransactions = transactions.map(({ uid, archived, __v, ...rest }) => rest);
    return res.status(StatusCodes.OK).json(sanitizedTransactions)
        
    } catch (error) {
        console.log("Get Transaction Error:", error)
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
    }
}

export const updateTransaction = async (req, res)=>{
    try {
       const {_id, ...rest} = req.body
       const token = req.headers.authorization;
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
       await Transaction.findOneAndUpdate(
          {_id:_id},
          rest,
          { new: true })
          return res.status(StatusCodes.OK).json({success: 'Successfully updated'}
        )
    } catch (error) {
        console.log("UpdateTransaction Error:", error)
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
    }
    
}

export const archiveTransaction = async (req, res) =>{
    try{
      const {_id} = req.body
         const token = req.headers.authorization;
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
            res.status(StatusCodes.OK).json({success: 'Successfully deleted'}
          )
    } catch {
          console.log("UpdateTransaction Error:", error)
          return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
    }
  }