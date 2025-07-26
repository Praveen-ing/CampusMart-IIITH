import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Item from "../models/itemModel.js";

export const registerUser = async (req, res) => {

    const { firstName, lastName, email, age, contactNumber, password } = req.body;
    if (!firstName || !lastName || !email || !age || !contactNumber || !password) {
        console.log("All fields were not sent");
        return res.status(404).json({ "success": false, "msg": "please send all fields" });
    }

    const userAlreadyExists = await User.findOne({ email });

    if (!userAlreadyExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            age,
            contactNumber,
            password: hashedPassword
        });
        console.log(newUser);
        if (!newUser) {
            console.log("Error in creating user");
            return res.status(500).json({ "success": false, "msg": "Internal server error" });
        }
        else {
            return res.status(201).json({
                // _id: newUser._id,
                // firstName: newUser.firstName,
                // lastName: newUser.lastName,
                // email: newUser.email,
                // age: newUser.age,
                // contactNumber: newUser.contactNumber,
                token: generatejwt(newUser._id)
            });
        }
    }
    else {
        console.log('user with this email already exists');
        return res.status(400).json({ "success": false, "msg": "user with this email already exists" });
    }

};

export const loginUser = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        console.log("All fields were not sent");
        return res.status(404).json({ "success": false, "msg": "please send all fields" });
    }

    const user = await User.findOne({ email });
    if (user) {
        const password_match = await bcrypt.compare(password, user.password);
        if (password_match) {
            return res.status(201).json({
                // _id: user._id,
                // firstName: user.firstName,
                // lastName: user.lastName,
                // email: user.email,
                // age: user.age,
                // contactNumber: user.contactNumber,
                token: generatejwt(user._id)
            });
        }
        else {
            console.log("Incorrect password");
            return res.status(400).json({ "success": false, "msg": "Incorrect password" });
        }
    }
    else {
        console.log("User with this email does not exist");
        return res.status(400).json({ "success": false, "msg": "User with this email does not exist" });
    }
};

export const getProfile = async (req, res) => {
    return res.status(200).json({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        age: req.user.age,
        contactNumber: req.user.contactNumber,
    });
}

export const updateProfile = async (req, res) => {

    const { firstName, lastName, age, contactNumber } = req.body;
    if (!firstName || !lastName || !age || !contactNumber) {
        console.log("All fields were not sent");
        return res.status(404).json({ "success": false, "msg": "please send all fields" });
    }

    const user = await User.findById(req.user._id);
    if (user) {
        user.firstName = firstName;
        user.lastName = lastName;
        user.age = age;
        user.contactNumber = contactNumber;
        await user.save();
        return res.status(201).json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            contactNumber: user.contactNumber
        });
    }
};

export const addItemToCart = async (req, res) => {
    const userId = req.user._id;
    const { itemId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, msg: "Item not found" });
        }

        // Check if the user is the seller of the item
        if (item.sellerID.toString() === userId.toString()) {
            console.log("You cannot add your own item to the cart");
            return res.status(400).json({ success: false, msg: "You cannot add your own item to the cart" });
        }

        user.cartItems.push(itemId);
        await user.save();

        res.status(200).json({ success: true, msg: "Item added to cart", cartItems: user.cartItems });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

// export const getCartItems = async (req, res) => {
//     const userId = req.user._id;

//     try {
//         const user = await User.findById(userId).populate('cartItems');
//         if (!user) {
//             return res.status(404).json({ success: false, msg: "User not found" });
//         }
//         res.status(200).json({ success: true, cartItems: user.cartItems });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, msg: "Internal server error" });
//     }
// };

export const getCartItems = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).populate({
            path: 'cartItems',
            select: 'name description price category ',
            populate: {
                path: 'sellerID',
                select: 'firstName lastName email'
            }
        });
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        const cartItemsWithPriceString = user.cartItems.map(item => ({
            ...item.toObject(),
            price: item.price.toString()
        }));

        res.status(200).json({ success: true, cartItems: cartItemsWithPriceString });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

export const removeItemFromCart = async (req, res) => {
    const userId = req.user._id;
    const  itemId  = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        const itemIndex = user.cartItems.indexOf(itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ success: false, msg: "Item not found in cart" });
        }

        user.cartItems.splice(itemIndex, 1);
        await user.save();

        res.status(200).json({ success: true, msg: "Item removed from cart", cartItems: user.cartItems });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

const generatejwt = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '25d'
    });
};





