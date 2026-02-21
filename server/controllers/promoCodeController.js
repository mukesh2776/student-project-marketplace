const PromoCode = require('../models/PromoCode');
const Project = require('../models/Project');

// @desc    Create promo code
// @route   POST /api/promo-codes
// @access  Private (Seller)
exports.createPromoCode = async (req, res, next) => {
    try {
        const { code, discountType, discountValue, project, usageLimit, expiresAt } = req.body;

        // Validate percentage max
        if (discountType === 'percentage' && discountValue > 100) {
            return res.status(400).json({ message: 'Percentage discount cannot exceed 100%' });
        }

        // If project is specified, make sure it belongs to the seller
        if (project) {
            const proj = await Project.findById(project);
            if (!proj) {
                return res.status(404).json({ message: 'Project not found' });
            }
            if (proj.seller.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'You can only create promo codes for your own projects' });
            }
        }

        const promoCode = await PromoCode.create({
            code,
            discountType,
            discountValue,
            seller: req.user._id,
            project: project || null,
            usageLimit: usageLimit || 0,
            expiresAt: expiresAt || null
        });

        res.status(201).json(promoCode);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'This promo code already exists' });
        }
        next(error);
    }
};

// @desc    Get my promo codes
// @route   GET /api/promo-codes/my-codes
// @access  Private (Seller)
exports.getMyCodes = async (req, res, next) => {
    try {
        const codes = await PromoCode.find({ seller: req.user._id })
            .populate('project', 'title')
            .sort({ createdAt: -1 });

        res.json(codes);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete promo code
// @route   DELETE /api/promo-codes/:id
// @access  Private (Seller - Owner)
exports.deletePromoCode = async (req, res, next) => {
    try {
        const promoCode = await PromoCode.findById(req.params.id);

        if (!promoCode) {
            return res.status(404).json({ message: 'Promo code not found' });
        }

        if (promoCode.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this promo code' });
        }

        await promoCode.deleteOne();
        res.json({ message: 'Promo code deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Validate promo code (for buyers at cart)
// @route   POST /api/promo-codes/validate
// @access  Private
exports.validatePromoCode = async (req, res, next) => {
    try {
        const { code, projectIds } = req.body;

        if (!code || !projectIds || projectIds.length === 0) {
            return res.status(400).json({ message: 'Please provide a promo code and at least one project' });
        }

        const promoCode = await PromoCode.findOne({
            code: code.toUpperCase(),
            isActive: true
        });

        if (!promoCode) {
            return res.status(404).json({ message: 'Invalid promo code' });
        }

        // Check expiry
        if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
            return res.status(400).json({ message: 'This promo code has expired' });
        }

        // Check usage limit
        if (promoCode.usageLimit > 0 && promoCode.usedCount >= promoCode.usageLimit) {
            return res.status(400).json({ message: 'This promo code has reached its usage limit' });
        }

        // Find which cart projects belong to this seller (or a specific project)
        let applicableProjectIds = [];

        if (promoCode.project) {
            // Code is tied to a specific project
            if (projectIds.includes(promoCode.project.toString())) {
                applicableProjectIds = [promoCode.project.toString()];
            }
        } else {
            // Code applies to all of the seller's projects in the cart
            const sellerProjects = await Project.find({
                _id: { $in: projectIds },
                seller: promoCode.seller
            });
            applicableProjectIds = sellerProjects.map(p => p._id.toString());
        }

        if (applicableProjectIds.length === 0) {
            return res.status(400).json({
                message: 'This promo code is not applicable to any projects in your cart'
            });
        }

        // Increment used count
        promoCode.usedCount += 1;
        await promoCode.save();

        res.json({
            valid: true,
            discountType: promoCode.discountType,
            discountValue: promoCode.discountValue,
            promoCodeId: promoCode._id,
            applicableProjectIds
        });
    } catch (error) {
        next(error);
    }
};
