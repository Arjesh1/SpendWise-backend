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
        default: 'https://www.pngarts.com/files/5/User-Avatar-PNG-Background-Image.png'
    },
})

export default mongoose.model('User', UserSchema)