const express = require('express');
const router = express.Router();
const {
    createReview,
    getProjectReviews,
    updateReview,
    deleteReview,
    getMyReviews
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/project/:projectId', getProjectReviews);

// Protected routes
router.post('/', protect, createReview);
router.get('/my-reviews', protect, getMyReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
