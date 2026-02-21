const express = require('express');
const router = express.Router();
const {
    register,
    login,
    verifyRegisterOTP,
    verifyLoginOTP,
    resendOTP,
    forgotPassword,
    verifyForgotPasswordOTP,
    resetPassword,
    getMe,
    updateProfile,
    getSellerProfile,
    updateRole,
    deleteAccount
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-register', verifyRegisterOTP);
router.post('/verify-login', verifyLoginOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/verify-forgot-password', verifyForgotPasswordOTP);
router.post('/reset-password', resetPassword);
router.get('/seller/:id', getSellerProfile);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/role', protect, updateRole);
router.delete('/account', protect, deleteAccount);

module.exports = router;
