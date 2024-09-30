// const express = require('express');
// const router = express.Router();
const User = require('../models/user.model');
const { getHash } = require('../helpers/hasher');


async function registerController (req, res) {
    const { username, email, password } = req.body;
    const hashedPassword = await getHash(password);

    // Check if the email already exists
    const validateEmail = await User.findOne({ email: email });
    if (validateEmail) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    //
    try {
        const user = await User.create(
            {
                username: username,
                email: email,
                password: hashedPassword,
                isVerified: false
                
            });
            await user.save();
            // console.log(res.cookie);
            return res.status(201).json({ success: true ,message: 'User Registered Successfully' });
    }
    catch (error) {
        console.error('Error registering user:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// module.exports = register;
module.exports = registerController;




// const register = async (req, res) => {
//     const { name, email, password } = req.body;
//     const hashedPassword = await getHash(password);
//     try {
//         const user = await User.create(
//             {
//                 name: name,
//                 email: email,
//                 password: hashedPassword,
                
//             });
//             await user.save();
//             return res.status(201).json({ success: true ,message: 'User Registered Successfully' });
//     }
//     catch (error) {
//         console.error('Error registering user:', error.message);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }