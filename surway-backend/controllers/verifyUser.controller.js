const User = require('../models/user.model');
const UserOTPVerification = require('../models/userOTPVerification');
const { sendEmail } = require('../helpers/sendEmail');

async function sendOTP(req, res) {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'User is already verified' });
        }

        // Send email and get OTP
        const response = await sendEmail(email, "VerifyEmail");
        const otp = response.otp;

        // Create OTP entry in database
        const userOTP = await UserOTPVerification.create({
            email: email,
            otp: otp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000 // Expires in 1 hour
        });

        await userOTP.save();
        return res.status(200).json({ success: true, message: 'OTP sent successfully' });

    } catch (error) {
        console.error('Error sending OTP:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function verifyOTP(req, res) {
    try {
        const { email, otp } = req.body;

        const userOTP = await UserOTPVerification.findOne({ email: email, otp: otp });
        console.log(`Email: ${email}, OTP: ${otp}`);  // Debugging
        if (!userOTP) {
            return res.status(400).json({ success: false, message: 'User with this email does not exist or invalid OTP' });
        }

        const currentTime = Date.now();
        if (currentTime > userOTP.expiresAt) {
            await UserOTPVerification.deleteMany({ email: email });
            return res.status(400).json({ success: false, message: 'OTP expired' });
            
        }
        if (userOTP.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
        else {
        // Update user's isVerified status
        const user = await User.findOneAndUpdate({ email: email }, { isVerified: true });
        await UserOTPVerification.deleteMany({ email: email });
        }

        return res.status(200).json({ success: true, message: 'User verified successfully' });

    } catch (error) {
        console.error('Error verifying OTP:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}   

module.exports = { sendOTP, verifyOTP };

