const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please provide a promo code'],
        unique: true,
        trim: true,
        maxlength: 20
    },
    discountType: {
        type: String,
        required: true,
        enum: ['percentage', 'fixed']
    },
    discountValue: {
        type: Number,
        required: [true, 'Please provide a discount value'],
        min: 1
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        default: null
    },
    usageLimit: {
        type: Number,
        default: 0 // 0 means unlimited
    },
    usedCount: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Auto-uppercase the code before saving
promoCodeSchema.pre('save', function (next) {
    if (this.isModified('code')) {
        this.code = this.code.toUpperCase();
    }
    next();
});

module.exports = mongoose.model('PromoCode', promoCodeSchema);
