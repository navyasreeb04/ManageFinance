const express = require("express");
const authController = require("../controllers/auth.controllers");
const authMiddleware = require("../middleware/auth.middleware");    
const router = express.Router();



//post/api/auth/register
router.post("/register", authController.userRegisterController);


//POST /api/auth/login
router.post("/login", authController.userLoginController);

//POST /api/auth/logout
router.post("/logout", authController.userLogoutController);


// PIN Reset Routes
router.post("/forgot-pin", authController.forgotPinController);
router.post("/verify-pin-otp", authController.verifyPinOTPController);
router.post("/reset-pin", authController.resetPinController);


// Password Reset Routes
router.post("/forgot-password", authController.forgotPasswordController);
router.post("/verify-password-otp", authController.verifyPasswordOTPController);
router.post("/reset-password", authController.resetPasswordController);


//  Change Password Route
router.post("/change-password", authMiddleware.authMiddleware, authController.changePasswordController);

// Add this route
router.post("/verify-pin", authMiddleware.authMiddleware, authController.verifyPinController);

// GET current user
router.get("/me", authMiddleware.authMiddleware, authController.getMeController);




module.exports = router;