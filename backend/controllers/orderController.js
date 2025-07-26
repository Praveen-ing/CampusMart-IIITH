import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Item from "../models/itemModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const getOrdersbySID = async (req, res) => {
    try {
        const orders = await Order.find({ sellerID: req.user._id })
            .populate('buyerID', 'firstName lastName email')
            .populate('itemID', 'name price');
            // Convert price to string
        const ordersWithPriceString = orders.map(order => ({
            ...order.toObject(),
            itemID: {
                ...order.itemID.toObject(),
                price: order.itemID.price.toString()
            }
        }));
        res.status(200).json({ success: true, orders:ordersWithPriceString });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};



export const addOrder = async (req, res) => {
    const buyerID = req.user._id;
    const { items } = req.body;

    try {
        const itemsWithSeller = await Promise.all(items.map(async (itemId) => {
            const item = await Item.findById(itemId);
            if (!item) {
                return res.status(404).json({ success: false, msg: "Item not found" });
            }
            return {
                itemId: item._id,
                sellerID: item.sellerID,
                amount: item.price
            };
        }));

        const otp = crypto.randomBytes(3).toString('hex');
        const hashedOtp = await bcrypt.hash(otp, 10);

        const orders = await Promise.all(itemsWithSeller.map(async (item) => {
            const order = new Order({
                transactionID: Math.floor(Math.random() * 1000000),
                buyerID: buyerID,
                sellerID: item.sellerID,
                itemID: item.itemId,
                amount: item.amount,
                hashedOTP: hashedOtp
            });
            await order.save();
            return order;
        }));

        const user = await User.findById(buyerID);
        user.cartItems = [];
        await user.save();

        res.status(200).json({ success: true, msg: "Order placed successfully!", otp });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

export const updateOrder = async (req, res) => {

   
};

export const getOrdersbyBID = async (req, res) => {
    try {
        const orders = await Order.find({ buyerID: req.user._id })
            .populate('sellerID', 'firstName lastName email')
            .populate('itemID', 'name price');

        // Convert price to string
        const ordersWithPriceString = orders.map(order => ({
            ...order.toObject(),
            itemID: {
                ...order.itemID.toObject(),
                price: order.itemID.price.toString()
            }
        }));

        res.status(200).json({ success: true, orders: ordersWithPriceString });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

export const verifyOtpAndCloseTransaction = async (req, res) => {
    const { orderId, otp } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, msg: "Order not found" });
        }

        const isOtpValid = await bcrypt.compare(otp, order.hashedOTP);
        if (!isOtpValid) {
            console.log("Invalid OTP");
            return res.status(400).json({ success: false, msg: "Invalid OTP" });
        }

        order.status = 'Completed';
        await order.save();

        res.status(200).json({ success: true, msg: "Transaction completed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};












