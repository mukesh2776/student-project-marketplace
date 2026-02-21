const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyPurchases,
    getMySales,
    getOrder,
    downloadProject,
    getDashboardStats
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/', createOrder);
router.get('/my-purchases', getMyPurchases);
router.get('/my-sales', getMySales);
router.get('/stats', getDashboardStats);
router.get('/:id', getOrder);
router.get('/:id/download', downloadProject);

module.exports = router;
