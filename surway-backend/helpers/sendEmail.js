const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const User = require('../models/user.model'); // Assuming you have a User model

require('dotenv').config();

async function sendEmail(email, purpose) {
    return new Promise(async (resolve, reject) => {

        // Find the user's name based on the email
        const user = await User.findOne({ email });
        const userName = user ? user.username : 'User'; // Fallback to 'User' if name not found

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const otp = randomstring.generate({ length: 6, charset: 'numeric' });

        const emailSubject =
            purpose === 'VerifyEmail' ?
                'OTP for email verification' : 'OTP for password reset';

        const emailBody =
            purpose === 'VerifyEmail'
                ? `<p>Hi ${userName},</p><p>Your OTP for email verification is <strong>${otp}</strong></p><p>This OTP expires in 1 hour.</p>`
                : `<p>Hi ${userName},</p><p>Your OTP for password reset is <strong>${otp}</strong></p><p>This OTP expires in 1 hour.</p>`;

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: emailSubject,
            html: emailBody
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject({ success: false, message: 'Failed to send email', error: error.message });
            } else {
                resolve({ success: true, message: 'Email sent successfully', info: info.response, otp });
            }
        });

    });
}

module.exports = { sendEmail };
