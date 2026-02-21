const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const { sendOTPEmail, generateOTP } = require('../utils/emailService');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d'
    });
};

// @desc    Register — Step 1: validate + send OTP
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Delete any existing OTP for this email + purpose
        await OTP.deleteMany({ email, purpose: 'register' });

        // Generate and save OTP
        const otp = generateOTP();
        await OTP.create({
            email,
            otp,
            purpose: 'register',
            userData: { name, email, password, role: role || 'both' }
        });

        // Send OTP email
        await sendOTPEmail(email, otp, 'register');

        res.json({
            step: 'otp',
            email,
            message: 'OTP sent to your email. Please verify to complete registration.'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Register — Step 2: verify OTP + create user
// @route   POST /api/auth/verify-register
// @access  Public
exports.verifyRegisterOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await OTP.findOne({ email, purpose: 'register' });
        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP expired or not found. Please register again.' });
        }

        // Check if OTP has expired
        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteMany({ email, purpose: 'register' });
            return res.status(400).json({ message: 'OTP has expired. Please register again.' });
        }

        // Verify OTP
        if (!otpRecord.matchOTP(otp)) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        // Check user doesn't already exist (race condition guard)
        const userExists = await User.findOne({ email });
        if (userExists) {
            await OTP.deleteMany({ email, purpose: 'register' });
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create user from stored data
        const { name, password, role } = otpRecord.userData;
        const user = await User.create({ name, email, password, role });

        // Clean up OTP
        await OTP.deleteMany({ email, purpose: 'register' });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login — Step 1: validate credentials + send OTP (admin skips OTP)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Admin login — skip OTP, return JWT directly
        if (user.role === 'admin') {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id)
            });
        }

        // Regular user — send OTP
        await OTP.deleteMany({ email, purpose: 'login' });

        const otp = generateOTP();
        await OTP.create({
            email,
            otp,
            purpose: 'login'
        });

        await sendOTPEmail(email, otp, 'login');

        res.json({
            step: 'otp',
            email,
            message: 'OTP sent to your email. Please verify to login.'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login — Step 2: verify OTP + return JWT
// @route   POST /api/auth/verify-login
// @access  Public
exports.verifyLoginOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await OTP.findOne({ email, purpose: 'login' });
        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP expired or not found. Please login again.' });
        }

        // Check if OTP has expired
        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteMany({ email, purpose: 'login' });
            return res.status(400).json({ message: 'OTP has expired. Please login again.' });
        }

        // Verify OTP
        if (!otpRecord.matchOTP(otp)) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        // Get user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Clean up OTP
        await OTP.deleteMany({ email, purpose: 'login' });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user._id)
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res, next) => {
    try {
        const { email, purpose } = req.body;

        if (!email || !purpose) {
            return res.status(400).json({ message: 'Email and purpose are required' });
        }

        // Find existing OTP record
        const existingOTP = await OTP.findOne({ email, purpose });

        // Rate limit: don't resend if less than 60 seconds since last OTP
        if (existingOTP && (new Date() - existingOTP.createdAt) < 60000) {
            return res.status(429).json({ message: 'Please wait before requesting a new OTP' });
        }

        // For register, we need the stored userData
        let userData = null;
        if (purpose === 'register' && existingOTP) {
            userData = existingOTP.userData;
        }

        // Delete old OTP
        await OTP.deleteMany({ email, purpose });

        // Generate new OTP
        const otp = generateOTP();
        const otpData = { email, otp, purpose };
        if (purpose === 'register' && userData) {
            otpData.userData = userData;
        }
        await OTP.create(otpData);

        // Send OTP email
        await sendOTPEmail(email, otp, purpose);

        res.json({ message: 'OTP resent successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password — Step 1: send OTP to email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal whether user exists — still return success
            return res.json({ email, message: 'If an account with that email exists, an OTP has been sent.' });
        }

        // Delete any existing reset-password OTP for this email
        await OTP.deleteMany({ email, purpose: 'reset-password' });

        // Generate and save OTP
        const otp = generateOTP();
        await OTP.create({
            email,
            otp,
            purpose: 'reset-password'
        });

        // Send OTP email
        await sendOTPEmail(email, otp, 'reset-password');

        res.json({
            email,
            message: 'If an account with that email exists, an OTP has been sent.'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password — Step 2: verify OTP, return reset token
// @route   POST /api/auth/verify-forgot-password
// @access  Public
exports.verifyForgotPasswordOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await OTP.findOne({ email, purpose: 'reset-password' });
        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' });
        }

        // Check if OTP has expired
        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteMany({ email, purpose: 'reset-password' });
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        // Verify OTP
        if (!otpRecord.matchOTP(otp)) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        // Clean up OTP
        await OTP.deleteMany({ email, purpose: 'reset-password' });

        // Generate a short-lived reset token (10 minutes)
        const resetToken = jwt.sign({ email, purpose: 'reset-password' }, process.env.JWT_SECRET || 'your-secret-key', {
            expiresIn: '10m'
        });

        res.json({
            resetToken,
            message: 'OTP verified. You can now set a new password.'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password — Step 3: reset password using reset token
// @route   POST /api/auth/reset-password
// @access  Public (requires resetToken)
exports.resetPassword = async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({ message: 'Reset token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Verify the reset token
        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'your-secret-key');
        } catch (err) {
            return res.status(400).json({ message: 'Invalid or expired reset token. Please start over.' });
        }

        if (decoded.purpose !== 'reset-password') {
            return res.status(400).json({ message: 'Invalid reset token.' });
        }

        // Find and update user
        const user = await User.findOne({ email: decoded.email }).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = newPassword;
        await user.save(); // pre-save hook will hash the password

        res.json({ message: 'Password reset successfully. You can now login with your new password.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, bio, college, skills, avatar } = req.body;

        const user = await User.findById(req.user._id);

        if (user) {
            user.name = name || user.name;
            user.bio = bio || user.bio;
            user.college = college || user.college;
            user.skills = skills || user.skills;
            user.avatar = avatar || user.avatar;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                bio: updatedUser.bio,
                college: updatedUser.college,
                skills: updatedUser.skills,
                avatar: updatedUser.avatar
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get seller profile
// @route   GET /api/auth/seller/:id
// @access  Public
exports.getSellerProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-email');
        if (!user) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// @desc    Update user role
// @route   PUT /api/auth/role
// @access  Private
exports.updateRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        // Validate role
        if (!['buyer', 'seller', 'both'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be buyer, seller, or both' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: 'Role updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
    try {
        const Project = require('../models/Project');

        // Delete all projects by this user
        await Project.deleteMany({ seller: req.user._id });

        // Delete the user
        await User.findByIdAndDelete(req.user._id);

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        next(error);
    }
};
