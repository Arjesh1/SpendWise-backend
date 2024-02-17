import mongoose from "mongoose";

const ResetSchema = new mongoose.Schema({
    email: String,
    code: String,
    expiresIn: {
        type: Number,
        default: Date.now() + 10 * 60 * 1000
    }
})

export default mongoose.model('ResetPw', ResetSchema)