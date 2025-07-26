import express from "express";

import { getItems, addItem, updateItem, deleteItem,getOneItem } from "../controllers/itemController.js";

import { authenticateUser } from "../middleware/authenticate_MW.js";

const router = express.Router();

router.get("/", authenticateUser, getItems);
router.get("/:id", authenticateUser, getOneItem);
router.post("/add", authenticateUser, addItem);
router.put("/update/:id", authenticateUser, updateItem);
router.delete("/delete/:id", authenticateUser, deleteItem);


export default router;