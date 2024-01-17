import mongoose from 'mongoose';

export const dbConnect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
        console.log(error)
        process.exit(1)
    } 
}

