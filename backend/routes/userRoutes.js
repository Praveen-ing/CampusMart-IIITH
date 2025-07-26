import express from "express";

import { registerUser, loginUser, getProfile,updateProfile, addItemToCart,getCartItems ,removeItemFromCart} from "../controllers/userController.js";

import { authenticateUser } from "../middleware/authenticate_MW.js";

const router = express.Router();


router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticateUser, getProfile);
router.put("/update", authenticateUser, updateProfile);
router.post('/cart',authenticateUser,addItemToCart);
router.get('/getcart',authenticateUser,getCartItems);
router.delete('/cart/:id',authenticateUser,removeItemFromCart);



export default router;