
const mongoose = require('mongoose');
// const Counter = require('./counter.model');  // Import the Counter model

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Pre-save hook to handle incremental ID
// userSchema.pre('save', async function (next) {
//     if (this.isNew) {
//         try {
//             const counter = await Counter.findByIdAndUpdate(
//                 { _id: 'userId' }, // Use a specific ID for your counter
//                 { $inc: { sequence_value: 1 } }, // Increment by 1
//                 { new: true, upsert: true } // Create if not exists, return the new document
//             );
//             this.id = counter.sequence_value;
//         } catch (error) {
//             return next(error);
//         }
//     }
//     next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
