import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiArrowLeft, HiShieldCheck } from 'react-icons/hi';

const Login = () => {
    const navigate = useNavigate();
    const { user, login, verifyLoginOTP, resendOTP, isAuthenticated } = useAuth();
    const { reloadCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState('credentials');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resendTimer, setResendTimer] = useState(0);
    const otpRefs = useRef([]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    if (isAuthenticated) {
        navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
        return null;
    }

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const result = await login(formData.email, formData.password);
            if (result.token) {
                reloadCart();
                toast.success('Welcome back, Admin!');
                navigate('/admin');
            } else if (result.step === 'otp') {
                setEmail(result.email);
                setStep('otp');
                setResendTimer(60);
                toast.success('OTP sent to your email!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

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

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            toast.error('Please enter the complete 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            await verifyLoginOTP(email, otpValue);
            reloadCart();
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'OTP verification failed');
            setOtp(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            await resendOTP(email, 'login');
            setResendTimer(60);
            setOtp(['', '', '', '', '', '']);
            toast.success('OTP resent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        }
    };

    const handleBackToCredentials = () => {
        setStep('credentials');
        setOtp(['', '', '', '', '', '']);
        setEmail('');
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {step === 'credentials' ? 'Welcome Back' : 'Verify Your Email'}
                    </h1>
                    <p className="text-gray-500">
                        {step === 'credentials'
                            ? 'Sign in to your account to continue'
                            : `Enter the 6-digit code sent to ${email}`}
                    </p>
                </div>

                {/* Login Form */}
                <div className="glass-card p-8">
                    {step === 'credentials' ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                leftIcon={<HiMail className="w-5 h-5" />}
                            />

                            <div className="relative">
                                <Input
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
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

                            <div className="flex items-center justify-between text-sm">
                                <Link to="/forgot-password" className="text-primary-500 hover:text-primary-600">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button type="submit" fullWidth loading={loading}>
                                Sign In
                            </Button>
                        </form>
                    ) : (
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
                                Verify & Sign In
                            </Button>

                            {/* Resend OTP */}
                            <div className="text-center">
                                {resendTimer > 0 ? (
                                    <p className="text-gray-500 text-sm">
                                        Resend OTP in <span className="text-primary-500 font-medium">{resendTimer}s</span>
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors"
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>

                            {/* Back button */}
                            <button
                                type="button"
                                onClick={handleBackToCredentials}
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors mx-auto"
                            >
                                <HiArrowLeft className="w-4 h-4" />
                                Back to login
                            </button>
                        </form>
                    )}
                </div>

                {/* Sign up link */}
                {step === 'credentials' && (
                    <p className="mt-8 text-center text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium">
                            Sign up for free
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;
