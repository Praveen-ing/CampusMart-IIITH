import Item from "../models/itemModel.js"
import User from "../models/userModel.js";

export const getItems = async (req, res) => {
    try {
        const items = await Item.find({}).populate('sellerID', 'firstName lastName email');
        const itemsWithPriceString = items.map(item => ({
            ...item.toObject(),
            price: item.price.toString()
            // seller: {
            //     firstName: item.sellerID.firstName,
            //     lastName: item.sellerID.lastName,
            //     email: item.sellerID.email
            // }
        }));
        res.status(200).json(itemsWithPriceString);
    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

export const getOneItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('sellerID', 'firstName lastName email');
        if (item) {
            const itemWithPriceString = {
                ...item.toObject(),
                price: item.price.toString()
            };
            res.status(200).json(itemWithPriceString);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

export const addItem = async (req, res) => {

    const { name, price, description, category} = req.body;

    const item = new Item({
        name,
        price,
        description,
        category,
        sellerID:req.user._id
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ success: false, msg:"Internal server error" });
    }

};

export const updateItem = async (req, res) => {

    const { name, price, description, category} = req.body;

    try {
        const item = await Item.findById(req.params.id);
        if (item) {
            item.name = name;
            item.price = price;
            item.description = description;
            item.category = category;

            const updatedItem = await item.save();
            res.status(200).json(updatedItem);
        } else {
            res.status(404).json({ success: false, msg: "Item not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }

};

export const deleteItem = async (req, res) => {
    const id = req.params.id;
    try {
        const item = await Item.findById(id);
        if (item) {
            await item.remove();
            res.status(200).json({ success: true, msg: "Item deleted" });
        } else {
            res.status(404).json({ success: false, msg: "Item not found" });
        }


    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error" });
    }

};






