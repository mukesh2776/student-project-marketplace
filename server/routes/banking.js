const express = require('express');
const router = express.Router();
const {
    getBankingDetails,
    upsertBankingDetails,
    deleteBankingDetails,
    getBankingStatus
} = require('../controllers/bankingController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.get('/', protect, getBankingDetails);
router.put('/', protect, upsertBankingDetails);
router.delete('/', protect, deleteBankingDetails);
router.get('/status', protect, getBankingStatus);

module.exports = router;
