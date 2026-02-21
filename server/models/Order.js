const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    commission: {
        type: Number,
        required: true
    },
    sellerEarning: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentId: {
        type: String,
        default: ''
    },
    paymentMethod: {
        type: String,
        default: ''
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    maxDownloads: {
        type: Number,
        default: 5
    },
    downloadToken: {
        type: String,
        default: ''
    },
    downloadExpiry: {
        type: Date
    }
}, {
    timestamps: true
});

// Commission rate (10%)
orderSchema.statics.COMMISSION_RATE = 0.10;

// Calculate commission before saving
orderSchema.pre('save', function (next) {
    if (this.isNew) {
        this.commission = this.amount * orderSchema.statics.COMMISSION_RATE;
        this.sellerEarning = this.amount - this.commission;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
