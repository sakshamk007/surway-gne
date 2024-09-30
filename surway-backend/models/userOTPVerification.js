const mongoose = require('mongoose');

const userOTPVerificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
    },
    expiresAt: {
        type: Date,
    }
});

const UserOTPVerification = mongoose.model('UserOTPVerification', userOTPVerificationSchema);

module.exports = UserOTPVerification;