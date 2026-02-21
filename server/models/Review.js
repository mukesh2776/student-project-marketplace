const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        maxlength: 100,
        default: ''
    },
    comment: {
        type: String,
        required: [true, 'Please provide a review comment'],
        maxlength: 1000
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Prevent duplicate reviews
reviewSchema.index({ user: 1, project: 1 }, { unique: true });

// Update project rating after review
reviewSchema.statics.calculateAverageRating = async function (projectId) {
    const result = await this.aggregate([
        { $match: { project: projectId } },
        {
            $group: {
                _id: '$project',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    try {
        const Project = require('./Project');
        if (result.length > 0) {
            await Project.findByIdAndUpdate(projectId, {
                rating: Math.round(result[0].averageRating * 10) / 10,
                totalReviews: result[0].totalReviews
            });
        } else {
            await Project.findByIdAndUpdate(projectId, {
                rating: 0,
                totalReviews: 0
            });
        }
    } catch (error) {
        console.error('Error updating project rating:', error);
    }
};

reviewSchema.post('save', function () {
    this.constructor.calculateAverageRating(this.project);
});

reviewSchema.post('remove', function () {
    this.constructor.calculateAverageRating(this.project);
});

module.exports = mongoose.model('Review', reviewSchema);
