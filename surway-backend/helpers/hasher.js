const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of rounds to use in hashing

async function getHash(plainTextPassword) {
    try {
        const hash = await bcrypt.hash(plainTextPassword, saltRounds);
        return hash;
    }
    catch (error) {
        console.error('Error hashing password:', error.message);
    }
}

async function compareHash(plainTextPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(plainTextPassword, hashedPassword);
        return match;
    }
    catch (error) {
        console.error('Error comparing password:', error.message);
    }
}

module.exports = { getHash, compareHash };

