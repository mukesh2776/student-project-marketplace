const express = require('express');
const router = express.Router();
const {
    getAdminStats,
    getAllUsers,
    getAllOrders,
    deleteUser,
    getAllProjects,
    deleteProject
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(protect, isAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.get('/projects', getAllProjects);
router.delete('/users/:id', deleteUser);
router.delete('/projects/:id', deleteProject);

module.exports = router;
