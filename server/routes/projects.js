const express = require('express');
const router = express.Router();
const {
    getProjects,
    getFeaturedProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getMyListings,
    getProjectsByCategory,
    getSimilarProjects
} = require('../controllers/projectController');
const { protect, isSeller } = require('../middleware/auth');

// Public routes
router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/category/:category', getProjectsByCategory);

// Protected routes (must be before /:id to avoid route conflicts)
router.get('/user/my-listings', protect, getMyListings);
router.post('/', protect, isSeller, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

// Dynamic ID routes (must be after specific routes)
router.get('/:id', getProject);
router.get('/:id/similar', getSimilarProjects);

module.exports = router;
