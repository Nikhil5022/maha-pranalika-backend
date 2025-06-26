const mongoose = require('mongoose');

const cibilTrainingSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, match: [/\S+@\S+\.\S+/, 'Invalid email format'], lowercase: true },
    phone: { type: String, required: true, match: [/^\d{10}$/, 'Phone number must be 10 digits'] },
    education: { type: String, required: true },
    preferedTrainingMode: { type: String, required: true },
    city: { type: String, required: true },
    experience: { type: String, required: true },
    remarks: { type: String, required: true },

    // Payment-related fields
    payment: {
        orderId: String,
        paymentId: String,
        signature: String,
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        },
        amount: Number,
        currency: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CibilTraining', cibilTrainingSchema);
