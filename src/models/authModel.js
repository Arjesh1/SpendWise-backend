import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    hashedPassword: String,
    goal: {
        type: String,
        default: '',
    },
    profileImg: {
        type: String,
    },
})

export default mongoose.model('User', UserSchema)