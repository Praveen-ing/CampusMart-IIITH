import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        age: {
            type: Number,
            required: true
        },
        contactNumber: {
            type: Number,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        cartItems: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
            required: false
        },
        sellerReviews: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);

export default User;