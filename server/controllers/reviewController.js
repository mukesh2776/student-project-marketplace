const Review = require('../models/Review');
const Order = require('../models/Order');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
    try {
        const { projectId, rating, title, comment } = req.body;

        // Check if user has purchased this project
        const order = await Order.findOne({
            buyer: req.user._id,
            project: projectId,
            paymentStatus: 'completed'
        });

        // Check if already reviewed
        const existingReview = await Review.findOne({
            user: req.user._id,
            project: projectId
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this project' });
        }

        const review = await Review.create({
            user: req.user._id,
            project: projectId,
            rating,
            title,
            comment,
            isVerifiedPurchase: !!order
        });

        const populatedReview = await Review.findById(review._id)
            .populate('user', 'name avatar');

        res.status(201).json(populatedReview);
    } catch (error) {
        next(error);
    }
};

// @desc    Get reviews for a project
// @route   GET /api/reviews/project/:projectId
// @access  Public
exports.getProjectReviews = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const reviews = await Review.find({ project: req.params.projectId })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Review.countDocuments({ project: req.params.projectId });

        // Calculate rating distribution
        const ratingDistribution = await Review.aggregate([
            { $match: { project: new (require('mongoose').Types.ObjectId)(req.params.projectId) } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);

        res.json({
            reviews,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            total,
            ratingDistribution
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
    try {
        const { rating, title, comment } = req.body;

        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check ownership
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }

        review = await Review.findByIdAndUpdate(
            req.params.id,
            { rating, title, comment },
            { new: true, runValidators: true }
        ).populate('user', 'name avatar');

        res.json(review);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check ownership
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        await review.deleteOne();

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
exports.getMyReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate('project', 'title thumbnail')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        next(error);
    }
};
