const express = require('express');
const router = express.Router();
const {
    createPromoCode,
    getMyCodes,
    deletePromoCode,
    validatePromoCode
} = require('../controllers/promoCodeController');
const { protect, isSeller } = require('../middleware/auth');

// Seller routes
router.post('/', protect, isSeller, createPromoCode);
router.get('/my-codes', protect, getMyCodes);
router.delete('/:id', protect, deletePromoCode);

// Buyer validation route
router.post('/validate', protect, validatePromoCode);

module.exports = router;
