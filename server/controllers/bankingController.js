const BankingDetails = require('../models/BankingDetails');

// @desc    Get current user's banking details
// @route   GET /api/banking
// @access  Private
exports.getBankingDetails = async (req, res, next) => {
    try {
        const details = await BankingDetails.findOne({ user: req.user._id });

        if (!details) {
            return res.status(404).json({ message: 'No banking details found' });
        }

        res.json(details);
    } catch (error) {
        next(error);
    }
};

// @desc    Create or update banking details
// @route   PUT /api/banking
// @access  Private
exports.upsertBankingDetails = async (req, res, next) => {
    try {
        const { accountHolderName, bankName, accountNumber, ifscCode, accountType, upiId } = req.body;

        // Validate required fields
        if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const details = await BankingDetails.findOneAndUpdate(
            { user: req.user._id },
            {
                user: req.user._id,
                accountHolderName,
                bankName,
                accountNumber,
                ifscCode,
                accountType: accountType || 'savings',
                upiId: upiId || '',
                isVerified: false // Reset verification on update
            },
            { new: true, upsert: true, runValidators: true }
        );

        res.json({
            message: 'Banking details saved successfully',
            data: details
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        next(error);
    }
};

// @desc    Delete banking details
// @route   DELETE /api/banking
// @access  Private
exports.deleteBankingDetails = async (req, res, next) => {
    try {
        const details = await BankingDetails.findOneAndDelete({ user: req.user._id });

        if (!details) {
            return res.status(404).json({ message: 'No banking details found to delete' });
        }

        res.json({ message: 'Banking details deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Check if user has banking details
// @route   GET /api/banking/status
// @access  Private
exports.getBankingStatus = async (req, res, next) => {
    try {
        const details = await BankingDetails.findOne({ user: req.user._id });

        res.json({
            hasBankingDetails: !!details,
            isVerified: details?.isVerified || false
        });
    } catch (error) {
        next(error);
    }
};
