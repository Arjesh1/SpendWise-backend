import { StatusCodes } from "http-status-codes"
import User from "../models/authModel.js"
import { comparePassword, hashPassword } from "../utils/bcrypt.js"
import { createJWT, verifyJWT } from "../utils/tokenUtils.js"
import { RESPONSE_MESSAGES } from "../utils/constants.js"
import ResetPw from "../models/resetPwModel.js"
import { emailOtp } from "../utils/nodemailer.js"

export const registerUser = async(req, res)=>{
    try {
        const {name, email, goal, profileImg, password,confirmPassword } = req.body
        if(password !== confirmPassword){
            return res.status(StatusCodes.UNAUTHORIZED).json({message: "Password and confirm password do not match!"})
        }
        const emailExist = await User.findOne({email:email})
        if(emailExist){
         return res.status(StatusCodes.UNAUTHORIZED).json({message: "Email already registered!"})
        }
        const hashedPassword =  hashPassword(password)
        const newUser = await User.create({name, email, goal, profileImg, hashedPassword})
        const userData = { 
           name: newUser.name,
           email: newUser.email,
           goal: newUser.goal,
           profileImg: newUser.profileImg
        }
        const token = createJWT({_id: newUser.id})
        return res.status(StatusCodes.OK).json({userData, token })
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.GATEWAY_TIMEOUT).json({message: RESPONSE_MESSAGES.ErrorMessage})
    }
}

export const loginUser = async(req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email:email})
        if(!user){
        return res.status(StatusCodes.NOT_FOUND).json({ message: "No user found" });
    }
    if(!comparePassword(password,user.hashedPassword)){
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication failed. Wrong Password" });
    }
      const token = createJWT({_id: user.id})
      const userData = { 
        email:user.email, 
        name:user.name, 
        goal:user.goal, 
        profileImg: user.profileImg
    }
    return res.status(StatusCodes.OK).json({ userData, token});
        
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.ErrorMessage });
    }
}

export const updateUserDetails = async (req, res)=>{
    try {
      const receivedToken = await req.headers.authorization;
      const decodedJWT = await verifyJWT(receivedToken)
      if(!decodedJWT || !decodedJWT._id){
        return res.status(StatusCodes.UNAUTHORIZED).json({message: RESPONSE_MESSAGES.ErrorMessage}) 
      }
        const user = await User.findById(decodedJWT._id)
        const allUsers = await User.find()
        const otherUsers = allUsers.filter((currentUser) => currentUser._id.toString() !== user._id.toString());
        const checkDuplicateEmail = otherUsers.find((otherUser) => otherUser.email === req.body.email)

        if(checkDuplicateEmail){
            return res.status(StatusCodes.UNAUTHORIZED).json({message: "Email already registered!"})
        }

        if(!user){
            return res.status(401).json({message: RESPONSE_MESSAGES.ErrorMessage})
        }
        const updateDetails = await User.findOneAndUpdate(
                {_id: user._id},
                req.body,
                { new: true }
        )

        const token = createJWT({_id: updateDetails.id})

        const updatedUserData = { 
              email:updateDetails.email, 
              name:updateDetails.name, 
              goal:updateDetails.goal, 
              profileImg: updateDetails.profileImg
        }
        return res.status(200).json({ updatedUserData, token})
    } catch (error) {
        console.error('Error updating user details:', error);
        return res.status(500).json({ message: RESPONSE_MESSAGES.ErrorMessage });
    }
}

export const changePassword = async (req, res) =>{
    const token = await req.headers.authorization;
    const confirmNewPassword =  await req.body.confirmNewPassword
    const password =  req.body.oldPassword
    const newPassword =  req.body.newPassword

    try {
        if(newPassword !== confirmNewPassword ){
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Password and confirm password do not match'})
        }
        const decodedJWT = await verifyJWT(token)
        if(!decodedJWT || !decodedJWT._id){
            return res.status(StatusCodes.BAD_REQUEST).json({message: RESPONSE_MESSAGES.ErrorMessage })

        }
          const user = await User.findById(decodedJWT._id)
          if(user){
            if(!comparePassword(password, user.hashedPassword)){
                return res.status(401).json({ message: "Authentication failed. Wrong Password" });
            }
            const hashedNewPassword = hashPassword(newPassword)
            await User.findOneAndUpdate(
                  {_id: user._id},
                  {$set: { hashedPassword: hashedNewPassword } },
                  { new: true }
              )
              return res.status(200).json({success: 'Password has been updated'})
          }
      } catch (error) {
          console.error(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.ErrorMessage });
      }
}

export const sendOTP = async (req, res) =>{
    try {
        const findUser =  await User.findOne(req.body)
        if(!findUser){
            return res.status(StatusCodes.NOT_FOUND).json({message: 'No user with this email found!'})
        }
        await ResetPw.findOneAndDelete(req.body)
        const {name, ...rest} = findUser
        function generateCode() {
            var minm = 100000;
            var maxm = 999999;
            return (Math.floor(Math
            .random() * (maxm - minm + 1)) + minm).toString();
        }
        const expiresIn = Date.now() + 10 * 60 * 1000
        const code = generateCode()
        const resetStorage = await ResetPw.create({...req.body, code, expiresIn}) 
        const emailSender  = await emailOtp(resetStorage.code, resetStorage.email, name)
        if(!emailSender){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.ErrorMessage }) 
        } 
        return res.status(StatusCodes.OK).json({success:'We have send you OTP in you email.'})

      } catch (error) {
          console.error(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.ErrorMessage });
      }
}

export const verfiyCode = async (req, res)=>{
    try {
        const {email,code} = req.body
        const requestTimeStamp = Date.now()
        const resetAccount = await ResetPw.findOne({email})
        if(!resetAccount){
            return res.status(StatusCodes.NOT_FOUND).json({ message: RESPONSE_MESSAGES.ErrorMessage })
        }

        if(resetAccount.code !== code){
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: 'Invalid OTP' })
        }

        if(resetAccount.expiresIn < requestTimeStamp){
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: 'OTP has expired!' })
        }

        return res.status(StatusCodes.OK).json({success:'OTP has been verified'})

    } catch (error) {
        console.error(error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.ErrorMessage });
        
    }
}

export const resetPassword = async (req, res)=>{
    try {
        const {email, code, password, confirmPassword} = req.body
        if(!email || !code){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.ErrorMessage });
        }

        if(password !== confirmPassword){
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({message: 'Password and confirm password do not match'})
        }

        const findUser =  await User.findOne({email})
        if(!findUser){
            return res.status(StatusCodes.NOT_FOUND).json({message: 'No user with this email found!'})
        }

        const resetAccount = await ResetPw.findOne({email})
        if(!resetAccount){
            return res.status(StatusCodes.NOT_FOUND).json({ message: RESPONSE_MESSAGES.ErrorMessage })
        }

        const requestTimeStamp = Date.now()
        if(resetAccount.code !== code){
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: 'Invalid OTP' })
        }

        if(resetAccount.expiresIn < requestTimeStamp){
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: 'OTP has expired!' })
        }

        const hashedNewPassword = hashPassword(password)
            await User.findOneAndUpdate(
                  {_id: findUser._id},
                  {$set: { hashedPassword: hashedNewPassword } },
                  { new: true }
              )
              return res.status(200).json({success: 'Password has been reset'})

    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.ErrorMessage });
    }
}
