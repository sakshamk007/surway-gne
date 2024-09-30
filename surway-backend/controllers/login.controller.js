// const express = require('express');
// const router = express.Router();
const User = require('../models/user.model');
const { compareHash } = require('../helpers/hasher');
const UserSession = require('../models/userSession.model');
const jwt = require('jsonwebtoken');


// This function is used to login the user
async function loginController (req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const passwordMatch = await compareHash(password, user.password);// Here we are comparing the password entered by the user(password) with the hashed password stored in the database(user.password)
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect password' });
        }
        // If the password is correct, insert the session in the database
        const sessionId = await insertSession(user,req, res);

        if(user.isVerified === true) {
            return res.status(200).json({ success: true, message: `User logged in successfully with id: ${sessionId}` });
        }
        else {
            return res.status(200).json({ success: true, message: "verify" });
        }

    }
    catch (error) {
        console.error('Error logging in:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }


}


// This function is used to insert the session in the database
async function insertSession (user,req, res) {
    try {
        const userAgent = req.headers['user-agent'];
        const expiryTime = new Date(Date.now() + 60 * 60* 24 * 365);// Here we are setting the expiry time of the cookie to 1 year
        const session = await UserSession.create(
            {
                user_id: user._id, // Directly use user._id (MongoDB's primary key) as the session ID
                user_agent: userAgent,
                expiry_time: expiryTime
            }); 
            const savedSession = await session.save();

            if(savedSession) {
                //Create a JWT token
                const token = jwt.sign({ session_id: savedSession.id }, process.env.JWT_SECRET);

                //Set the JWT token in a cookie
                res.cookie('session', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'
                });
                return savedSession.id; // Return the session ID
            }
            else {
                return res.status(500).json({ success: false, message: 'Error creating session' });
            }
    }
    catch (error) {
        console.error('Error creating session:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}
    

// module.exports = register;
module.exports = {loginController, insertSession};
