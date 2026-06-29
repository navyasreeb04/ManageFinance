const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blackList.model")

async function authMiddleware(req,res,next){
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header
    //console.log("Token from authMiddleware:", token); // Log the token for debugging purposes
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access token is missing" });
    }

    const isBlacklisted = await tokenBlackListModel.findOne({token})

    if(isBlacklisted)
    {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId)
        //select("-password"); // Exclude the password field from the user object


        req.user = user; // Attach the user object to the request for further use in the route handler
        return next();
    } catch (error) {
        return res.status(401).json({ 
            message: "Unauthorized access, token is invalid" });
    }
}

async function authSystemUserMiddleware(req,res,next)
{
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]; 
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access token is missing" });
    }


     const isBlacklisted = await tokenBlackListModel.findOne({token})

    if(isBlacklisted)
    {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }

    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select("+systemUser"); // include the system user field from the user object
        if(!user.systemUser)
        {
            return res.status(403).json({
                message: "Forbidden access, not a system user"
            })
        }
        req.user = user; // Attach the user object to the request for further use in the route handler
        return next();
    } catch (error) {
        return res.status(401).json({ 
            message: "Unauthorized access, token is invalid" });
    }
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
};