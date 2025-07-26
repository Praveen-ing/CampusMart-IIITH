import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        transactionID: {
            type: Number,
            required: true,
        },
        buyerID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        sellerID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        itemID: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Item',
            required: true,
        },
        amount: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
        hashedOTP: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: 'Pending'  
        }
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;