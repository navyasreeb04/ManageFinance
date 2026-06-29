const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const tokenBlackListModel = require("../models/blackList.model")
const bcrypt = require('bcryptjs');
/**
 * user register controller
 * POST /api/auth/register
*/

async function userRegisterController(req,res){
    const {email,password,name,transactionPin} = req.body; 

    const isExists = await userModel.findOne({
        email: email
    });

    if(isExists){
        return res.status(422).json({
            message: "User already exists with this email",
            status: "failed"
        });
    }

    const user = await userModel.create({
        email, password, name,transactionPin: transactionPin
    }); 


    const token = jwt.sign({
        userId : user._id
    }, process.env.JWT_SECRET, {
        expiresIn: "3d"
    })

    res.cookie("token",token)
    res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            hasPin: !!user.transactionPin,
        },
        token,
        message: "User registered successfully",
        status: "success",  
    });

    await emailService.sendRegistrationEmail(user.email,user.name);
}


/**
 * user login controller
 * POST /api/auth/login
*/
async function userLoginController(req,res){
    const {email,password} = req.body;  
    const user = await userModel.findOne({
        email
    }).select("+password"); //to include the password field in the query result, which is necessary for verifying the user's credentials during login. By default, the password field is excluded from query results due to the select: false option in the user schema, so we need to explicitly include it here to perform the password comparison.

    if(!user){
        return res.status(401).json({
            message: "Email or password is INVALID",
            status: "failed"
        });
    }
    //console.log(password,this.password); 
    console.log('Login attempt for:', email);   
    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({
            message: "Email or password is INVALID",
            status: "failed"
        });
    }

    const token = jwt.sign({
        userId: user._id
    }, process.env.JWT_SECRET, {
        expiresIn: "3d"
    });

    res.cookie("token", token);
    res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            hasPin: !!user.transactionPin  // Tell frontend if user has PIN
        },
        token,
        message: "User logged in successfully",
        status: "success"
    });
}


async function userLogoutController(req,res)
{
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token)
    {
        return res.status(200).json({
            message: "User logout successfully"
        })
    }

    
    await tokenBlackListModel.create({
        token: token
    })
    res.clearCookie("token") //clearing the token from the cookies

    return res.status(200).json({
        message: "User logged out successfully"
    })
}


/**
 * Get Current User Info
 * GET /api/auth/me
 */
async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user._id).select("+transactionPin");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                hasPin: !!user.transactionPin, // Returns true if PIN exists
            }
        });
    } catch (error) {
        console.error('Error in getMeController:', error);
        res.status(500).json({ message: error.message });
    }
}



 //Forgot PIN - Send OTP
async function forgotPinController(req, res) {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({
            message: "Email is required",
            status: "failed"
        });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: "User not found with this email",
            status: "failed"
        });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in a temporary collection or Redis (simplified: store in user document)
    // For production, use Redis or a separate OTP collection
    user.pinResetOTP = otp;
    user.pinResetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP via email
    try {
        await emailService.sendPinResetOTP(email, user.name, otp);
    } catch (error) {
        console.error('Email error:', error);
    }

    res.status(200).json({
        message: "OTP sent to your email",
        status: "success"
    });
}

// ADD THIS: Verify PIN OTP
async function verifyPinOTPController(req, res) {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
        return res.status(400).json({
            message: "Email and OTP are required",
            status: "failed"
        });
    }

    const user = await userModel.findOne({ email }).select("+pinResetOTP +pinResetOTPExpiry");
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            status: "failed"
        });
    }

    if (!user.pinResetOTP || user.pinResetOTP !== otp) {
        return res.status(400).json({
            message: "Invalid OTP",
            status: "failed"
        });
    }

    if (Date.now() > user.pinResetOTPExpiry) {
        return res.status(400).json({
            message: "OTP has expired",
            status: "failed"
        });
    }

    res.status(200).json({
        message: "OTP verified successfully",
        status: "success"
    });
}

// ADD THIS: Reset PIN
async function resetPinController(req, res) {
    const { email, otp, newPin } = req.body;
    
    if (!email || !otp || !newPin) {
        return res.status(400).json({
            message: "Email, OTP and new PIN are required",
            status: "failed"
        });
    }

    if (newPin.length < 4) {
        return res.status(400).json({
            message: "PIN must be at least 4 digits",
            status: "failed"
        });
    }

    const user = await userModel.findOne({ email }).select("+pinResetOTP +pinResetOTPExpiry");
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            status: "failed"
        });
    }

    if (!user.pinResetOTP || user.pinResetOTP !== otp) {
        return res.status(400).json({
            message: "Invalid OTP",
            status: "failed"
        });
    }

    if (Date.now() > user.pinResetOTPExpiry) {
        return res.status(400).json({
            message: "OTP has expired",
            status: "failed"
        });
    }

    // Hash and save new PIN
    // const hashedPin = await bcrypt.hash(newPin, 10);
    // user.transactionPin = hashedPin;
    //set plai pin pre-save will hash it 
    user.transactionPin = newPin;
    user.pinResetOTP = undefined;
    user.pinResetOTPExpiry = undefined;
    await user.save();

    res.status(200).json({
        message: "PIN reset successfully",
        status: "success"
    });
}

// Forgot Password - Send OTP
async function forgotPasswordController(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required",
            status: "failed"
        });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: "User not found with this email",
            status: "failed"
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.passwordResetOTP = otp;
    user.passwordResetOTPExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
        await emailService.sendPasswordResetOTP(email, user.name, otp);
    } catch (error) {
        console.error('Email error:', error);
    }

    res.status(200).json({
        message: "OTP sent to your email",
        status: "success"
    });
}

// Verify Password OTP
async function verifyPasswordOTPController(req, res) {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            message: "Email and OTP are required",
            status: "failed"
        });
    }

    const user = await userModel.findOne({ email }).select("+passwordResetOTP +passwordResetOTPExpiry");
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            status: "failed"
        });
    }

    if (!user.passwordResetOTP || user.passwordResetOTP !== otp) {
        return res.status(400).json({
            message: "Invalid OTP",
            status: "failed"
        });
    }

    if (Date.now() > user.passwordResetOTPExpiry) {
        return res.status(400).json({
            message: "OTP has expired",
            status: "failed"
        });
    }

    res.status(200).json({
        message: "OTP verified successfully",
        status: "success"
    });
}

// Reset Password
async function resetPasswordController(req, res) {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            message: "Email, OTP and new password are required",
            status: "failed"
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters",
            status: "failed"
        });
    }

    const user = await userModel.findOne({ email }).select("+passwordResetOTP +passwordResetOTPExpiry");
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            status: "failed"
        });
    }

    if (!user.passwordResetOTP || user.passwordResetOTP !== otp) {
        return res.status(400).json({
            message: "Invalid OTP",
            status: "failed"
        });
    }

    if (Date.now() > user.passwordResetOTPExpiry) {
        return res.status(400).json({
            message: "OTP has expired",
            status: "failed"
        });
    }

    user.password = newPassword;
    user.passwordResetOTP = undefined;
    user.passwordResetOTPExpiry = undefined;
    await user.save();

    res.status(200).json({
        message: "Password reset successfully",
        status: "success"
    });
}

async function changePasswordController(req, res) {
    const { currentPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user._id).select("+password");

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            status: "failed"
        });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        return res.status(401).json({
            message: "Current password is incorrect",
            status: "failed"
        });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        message: "Password changed successfully",
        status: "success"
    });
}

/**
 * Verify Transaction PIN
 * POST /api/auth/verify-pin
 */
// Verify Transaction PIN (with logs)
async function verifyPinController(req, res) {
  const { pin } = req.body;
  console.log('PIN verification request for user:', req.user?._id);
  console.log('Received PIN:', pin);

  if (!pin) {
    console.log(' No PIN provided');
    return res.status(400).json({ message: "PIN is required" });
  }

  try {
    // Explicitly select transactionPin field
    const user = await userModel.findById(req.user._id).select("+transactionPin");
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: "User not found" });
    }

    console.log('Stored PIN hash:', user.transactionPin);
    console.log('Comparing with:', pin);

    // Compare using the method
    const isMatch = await user.compareTransactionPin(pin);
    console.log(' Match result:', isMatch);

    if (!isMatch) {
      console.log('PIN mismatch');
      return res.status(401).json({ message: "Invalid PIN" });
    }

    console.log('PIN verified for user:', user._id);
    res.status(200).json({ message: "PIN verified" });
  } catch (error) {
    console.error('PIN verification error:', error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController,
    getMeController,
    forgotPinController,      
    verifyPinOTPController,   
    resetPinController ,
    changePasswordController,
    verifyPinController,
    forgotPasswordController,
    verifyPasswordOTPController,
    resetPasswordController,
}