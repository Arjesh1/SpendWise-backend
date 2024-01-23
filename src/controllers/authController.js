import { StatusCodes } from "http-status-codes"
import User from "../models/authModel.js"
import { comparePassword, hashPassword } from "../utils/bcrypt.js"
import { createJWT, verifyJWT } from "../utils/tokenUtils.js"


export const registerUser = async(req, res)=>{
    try {
        const {name, email, goal, profileImg, password} = req.body
    const emailExist = await User.findOne({email:email})
    if(emailExist){
         return res.status(StatusCodes.UNAUTHORIZED).json({message: "Email already registered!"})
    }
    const hashedPassword =  hashPassword(password)
    const newUser = await User.create({name, email, goal, profileImg, hashedPassword})
    const resUserData = { 
        name: newUser.name,
        email: newUser.email,
        goal: newUser.goal,
        profileImg: newUser.profileImg}
    const token = createJWT({_id: newUser.id})
    res.status(StatusCodes.OK).json({resUserData, token })
        
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.GATEWAY_TIMEOUT).json({message: "Email already registered!"})
    }
}

export const loginUser = async(req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email:email})
        if(!user){
        return res.status(401).json({ message: "Authentication failed. No user found" });
    }
    if(!comparePassword(password,user.hashedPassword)){
        return res.status(401).json({ message: "Authentication failed. Wrong Password" });
    }
      const token = createJWT({_id: user.id})
  
    return res.json({ id:token, email:user.email, name:user.name, goal:user.goal, profileImg: user.profileImg});
        
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateUserDetails = async (req, res)=>{
    try {
      const token = req.params.token
      const decodedJWT = await verifyJWT(token)
      if(decodedJWT && decodedJWT._id){
        const user = await User.findById(decodedJWT._id)
        if(user){
            const updateDetails = await User.findOneAndUpdate(
                {_id: user._id},
                req.body,
                { new: true }
            )
            return res.status(200).json({updateDetails})
        }
      }
      res.status(401).json({message: 'SomeThing went worng.'})
        
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const updatingPassword = async (req, res) =>{
    const {password, newPassword} = req.body
    try {
        const token = req.params.token
        const decodedJWT = await verifyJWT(token)
        if(decodedJWT && decodedJWT._id){
          const user = await User.findById(decodedJWT._id)
          console.log(user)
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
              return res.status(200).json({user})
          }
        } 
      } catch (error) {
          console.error('Error updating user details:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }

}
