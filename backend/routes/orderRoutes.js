import express from "express";

import { getOrdersbySID, addOrder, updateOrder,getOrdersbyBID,verifyOtpAndCloseTransaction } from "../controllers/orderController.js";

import { authenticateUser } from "../middleware/authenticate_MW.js";

const router = express.Router();

router.get("/seller", authenticateUser, getOrdersbySID);
router.get("/buyer", authenticateUser, getOrdersbyBID);
router.post("/add", authenticateUser, addOrder);
router.put("/update", authenticateUser, updateOrder);
router.put("/verify", authenticateUser,verifyOtpAndCloseTransaction);


export default router;