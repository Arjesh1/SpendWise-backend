import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    hashedPassword: String,
    goal: String,
    profileImg: String,
})

export default mongoose.model('User', UserSchema)