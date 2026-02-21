import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiArrowLeft, HiShieldCheck, HiKey } from 'react-icons/hi';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('email'); // 'email' | 'otp' | 'reset'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resendTimer, setResendTimer] = useState(0);
    const [resetToken, setResetToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const otpRefs = useRef([]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Step 1: Send OTP
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setErrors({ email: 'Email is required' });
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors({ email: 'Please enter a valid email' });
            return;
        }
        setErrors({});
        setLoading(true);
        try {
            await authAPI.forgotPassword({ email });
            setStep('otp');
            setResendTimer(60);
            toast.success('Reset code sent to your email!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset code');
        } finally {
            setLoading(false);
        }
    };

    // OTP input handlers
    const handleOtpChange = (index, value) => {
        if (value.length > 1) {
            const digits = value.replace(/\D/g, '').slice(0, 6).split('');
            const newOtp = [...otp];
            digits.forEach((d, i) => {
                if (index + i < 6) newOtp[index + i] = d;
            });
            setOtp(newOtp);
            const nextIndex = Math.min(index + digits.length, 5);
            otpRefs.current[nextIndex]?.focus();
            return;
        }
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    // Step 2: Verify OTP
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            toast.error('Please enter the complete 6-digit code');
            return;
        }
        setLoading(true);
        try {
            const response = await authAPI.verifyForgotPasswordOTP({ email, otp: otpValue });
            setResetToken(response.data.resetToken);
            setStep('reset');
            toast.success('Code verified! Set your new password.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
            setOtp(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        try {
            await authAPI.forgotPassword({ email });
            setResendTimer(60);
            setOtp(['', '', '', '', '', '']);
            toast.success('Reset code resent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend code');
        }
    };

    // Step 3: Reset password
    const handleResetSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!passwords.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwords.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }
        if (!passwords.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (passwords.newPassword !== passwords.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        setLoading(true);
        try {
            await authAPI.resetPassword({ resetToken, newPassword: passwords.newPassword });
            toast.success('Password reset successfully!');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const getTitle = () => {
        switch (step) {
            case 'email': return 'Forgot Password';
            case 'otp': return 'Verify Your Email';
            case 'reset': return 'Set New Password';
            default: return 'Forgot Password';
        }
    };

    const getSubtitle = () => {
        switch (step) {
            case 'email': return 'Enter your email and we\'ll send you a reset code';
            case 'otp': return `Enter the 6-digit code sent to ${email}`;
            case 'reset': return 'Choose a strong new password for your account';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">S</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{getTitle()}</h1>
                    <p className="text-gray-500">{getSubtitle()}</p>
                </div>

                {/* Card */}
                <div className="glass-card p-8">
                    {step === 'email' && (
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({});
                                }}
                                error={errors.email}
                                leftIcon={<HiMail className="w-5 h-5" />}
                            />
                            <Button type="submit" fullWidth loading={loading}>
                                Send Reset Code
                            </Button>
                        </form>
                    )}

                    {step === 'otp' && (
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            {/* OTP Icon */}
                            <div className="flex justify-center mb-2">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                                    <HiShieldCheck className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            {/* OTP Input Boxes */}
                            <div className="flex justify-center gap-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (otpRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            <Button type="submit" fullWidth loading={loading}>
                                Verify Code
                            </Button>

                            {/* Resend OTP */}
                            <div className="text-center">
                                {resendTimer > 0 ? (
                                    <p className="text-gray-500 text-sm">
                                        Resend code in <span className="text-primary-500 font-medium">{resendTimer}s</span>
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors"
                                    >
                                        Resend Code
                                    </button>
                                )}
                            </div>

                            {/* Back button */}
                            <button
                                type="button"
                                onClick={() => {
                                    setStep('email');
                                    setOtp(['', '', '', '', '', '']);
                                }}
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors mx-auto"
                            >
                                <HiArrowLeft className="w-4 h-4" />
                                Change email
                            </button>
                        </form>
                    )}

                    {step === 'reset' && (
                        <form onSubmit={handleResetSubmit} className="space-y-6">
                            {/* Key Icon */}
                            <div className="flex justify-center mb-2">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                                    <HiKey className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            <div className="relative">
                                <Input
                                    label="New Password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    value={passwords.newPassword}
                                    onChange={handlePasswordChange}
                                    error={errors.newPassword}
                                    leftIcon={<HiLockClosed className="w-5 h-5" />}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="relative">
                                <Input
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    value={passwords.confirmPassword}
                                    onChange={handlePasswordChange}
                                    error={errors.confirmPassword}
                                    leftIcon={<HiLockClosed className="w-5 h-5" />}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                </button>
                            </div>

                            <Button type="submit" fullWidth loading={loading}>
                                Reset Password
                            </Button>
                        </form>
                    )}
                </div>

                {/* Back to login link */}
                <p className="mt-8 text-center text-gray-500">
                    Remember your password?{' '}
                    <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
