import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authenticateUser = async (req, res, next) => {
    
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded_token.id).select('-password');

            next();
        }catch (error) {
            console.log("Error in verifying token: ", error);
            return res.status(401).json({ "success": false, "msg": "Not authorized" });
        }
    }

    if (!token) {
        return res.status(401).json({ "success": false, "msg": "Not authorized, token unavailable" });
    }
}