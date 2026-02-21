const mongoose = require('mongoose');

const bankingDetailsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    accountHolderName: {
        type: String,
        required: [true, 'Please provide account holder name'],
        trim: true,
        maxlength: 100
    },
    bankName: {
        type: String,
        required: [true, 'Please provide bank name'],
        trim: true,
        maxlength: 100
    },
    accountNumber: {
        type: String,
        required: [true, 'Please provide account number'],
        trim: true,
        maxlength: 20
    },
    ifscCode: {
        type: String,
        required: [true, 'Please provide IFSC code'],
        trim: true,
        uppercase: true,
        match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please provide a valid IFSC code']
    },
    accountType: {
        type: String,
        enum: ['savings', 'current'],
        default: 'savings'
    },
    upiId: {
        type: String,
        trim: true,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BankingDetails', bankingDetailsSchema);
