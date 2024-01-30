import { StatusCodes } from "http-status-codes";
import uploadFile from "../utils/s3Bucket.js"
import { verifyJWT } from "../utils/tokenUtils.js";
import User from '../models/authModel.js'

  export const uploadImages = async (req, res) => {
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
        const key = `${userId._id}/${Date.now()}`; 

        const awsResponse = await uploadFile(key)
        console.log(awsResponse)
        return res.status(200).json({ awsResponse })

    } catch (error) {
        console.error('Error in uploadImages:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};