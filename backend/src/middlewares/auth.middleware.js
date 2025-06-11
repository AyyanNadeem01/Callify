import jwt from "jsonwebtoken";
import User from "../models/User.js";
export async function protectRoute(req, res, next) {
    try{
        const token=req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        req.user = user;
        next();
    }catch(error){
        console.error("Error in protectRoute middleware:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}