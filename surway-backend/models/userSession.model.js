const mongoose = require('mongoose');
// const Counter = require('./counter.model'); // Import the Counter model

const userSessionSchema = new mongoose.Schema({
    
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId instead of Number
        ref: 'User', // Reference the 'User' model
        required: true
    },
    user_agent: {
        type: String,
        required: true
    },
    creation_time: {
        type: Date,
        default: Date.now
    },
    expiry_time: {
        type: Date,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    }
});

// Pre-save hook to handle incremental ID
// userSessionSchema.pre('save', async function (next) {
//     if (this.isNew) {
//         try {
//             const counter = await Counter.findByIdAndUpdate(
//                 { _id: 'sessionId' }, // Use a specific ID for your counter
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

const UserSession = mongoose.model('UserSession', userSessionSchema);

module.exports = UserSession;
