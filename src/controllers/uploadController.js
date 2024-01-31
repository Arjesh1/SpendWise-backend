import { StatusCodes } from "http-status-codes";
import uploadFile from "../utils/s3Bucket.js"
import { verifyJWT } from "../utils/tokenUtils.js";
import User from '../models/authModel.js'

  export const uploadImages = async (req, res) => {
    try {
        const token = await req.headers.authorization;
        const image = req.file
        if(!image){
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
        const folderName = userId._id
        const key = `${userId._id}.${image.originalname}`; 

        const awsResponse = await uploadFile(image, folderName, key)
        
        if(!awsResponse){
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Something went wrong. Please try again later.'})
        }

        const updateDetails = await User.findOneAndUpdate(
            {_id: user._id},
            {'profileImg': awsResponse},
            { new: true })

            const updatedUserData = { 
                email:updateDetails.email, 
                name:updateDetails.name, 
                goal:updateDetails.goal, 
                profileImg: updateDetails.profileImg
          }
        return res.status(200).json({updatedUserData, success:'Profile image has been updated'})

    } catch (error) {
        console.error('Error in uploadImages:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};