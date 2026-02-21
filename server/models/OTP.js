const mongoose = require('mongoose');
const crypto = require('crypto');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ['login', 'register', 'reset-password'],
        required: true
    },
    // Store pending registration data (only for register purpose)
    userData: {
        name: String,
        email: String,
        password: String,
        role: String
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// TTL index — MongoDB auto-deletes expired documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Unique constraint: one OTP per email+purpose at a time
otpSchema.index({ email: 1, purpose: 1 });

// Hash OTP before saving
otpSchema.pre('save', function (next) {
    if (!this.isModified('otp')) return next();
    this.otp = crypto.createHash('sha256').update(this.otp).digest('hex');
    next();
});

// Compare OTP
otpSchema.methods.matchOTP = function (enteredOTP) {
    const hashed = crypto.createHash('sha256').update(enteredOTP).digest('hex');
    return this.otp === hashed;
};

module.exports = mongoose.model('OTP', otpSchema);
