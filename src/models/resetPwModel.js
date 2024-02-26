import mongoose from "mongoose";

const ResetSchema = new mongoose.Schema({
    email: String,
    code: String,
    expiresIn: Number
})

export default mongoose.model('ResetPw', ResetSchema)