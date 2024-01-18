import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    amount: String,
    date:String,
    name: String,
    type: {
        type:String,
        enum: ['income', 'expenses']
    },
    category: {
        type:String,
        enum: ['Travel', 'Grocery', 'Shopping', 'Other', 'Food', 'House']
    },
})

export default mongoose.model('Transaction', TransactionSchema)