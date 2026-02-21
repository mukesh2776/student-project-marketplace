import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff, HiArrowLeft, HiShieldCheck } from 'react-icons/hi';

const Register = () => {
    const navigate = useNavigate();
    const { register, verifyRegisterOTP, resendOTP, isAuthenticated } = useAuth();
    const { reloadCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState('form');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resendTimer, setResendTimer] = useState(0);
    const otpRefs = useRef([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'both',
    });
    const [errors, setErrors] = useState({});

    if (isAuthenticated) {
        navigate('/dashboard');
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
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const result = await register(formData.name, formData.email, formData.password, formData.role);
            if (result.step === 'otp') {
                setEmail(result.email);
                setStep('otp');
                setResendTimer(60);
                toast.success('OTP sent to your email!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
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
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
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
            await verifyRegisterOTP(email, otpValue);
            reloadCart();
            toast.success('Account created successfully!');
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
            await resendOTP(email, 'register');
            setResendTimer(60);
            setOtp(['', '', '', '', '', '']);
            toast.success('OTP resent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        }
    };

    const handleBackToForm = () => {
        setStep('form');
        setOtp(['', '', '', '', '', '']);
        setEmail('');
    };

    const roles = [
        { value: 'buyer', label: 'Buyer', description: 'I want to buy projects' },
        { value: 'seller', label: 'Seller', description: 'I want to sell projects' },
        { value: 'both', label: 'Both', description: 'I want to buy and sell' },
    ];

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
                        {step === 'form' ? 'Create Account' : 'Verify Your Email'}
                    </h1>
                    <p className="text-gray-500">
                        {step === 'form'
                            ? 'Join thousands of students on our platform'
                            : `Enter the 6-digit code sent to ${email}`}
                    </p>
                </div>

                {/* Form */}
                <div className="glass-card p-8">
                    {step === 'form' ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input label="Full Name" type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} error={errors.name} leftIcon={<HiUser className="w-5 h-5" />} />
                            <Input label="Email" type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} error={errors.email} leftIcon={<HiMail className="w-5 h-5" />} />

                            <div className="relative">
                                <Input label="Password" type={showPassword ? 'text' : 'password'} name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} error={errors.password} leftIcon={<HiLockClosed className="w-5 h-5" />} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                </button>
                            </div>

                            <Input label="Confirm Password" type={showPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} leftIcon={<HiLockClosed className="w-5 h-5" />} />

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    What do you want to do?
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {roles.map((role) => (
                                        <button
                                            key={role.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: role.value })}
                                            className={`p-3 rounded-xl text-center transition-all ${formData.role === role.value
                                                ? 'bg-primary-50 border-2 border-primary-500 text-primary-600'
                                                : 'bg-gray-50 text-gray-500 hover:text-gray-700 border-2 border-transparent'
                                                }`}
                                        >
                                            <span className="font-medium text-sm">{role.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-start gap-2 text-sm">
                                <input type="checkbox" required className="mt-1 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                                <span className="text-gray-500">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-primary-500 hover:text-primary-600">Terms of Service</Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="text-primary-500 hover:text-primary-600">Privacy Policy</Link>
                                </span>
                            </div>

                            <Button type="submit" fullWidth loading={loading}>
                                Create Account
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <div className="flex justify-center mb-2">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                                    <HiShieldCheck className="w-8 h-8 text-white" />
                                </div>
                            </div>

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
                                Verify & Create Account
                            </Button>

                            <div className="text-center">
                                {resendTimer > 0 ? (
                                    <p className="text-gray-500 text-sm">
                                        Resend OTP in <span className="text-primary-500 font-medium">{resendTimer}s</span>
                                    </p>
                                ) : (
                                    <button type="button" onClick={handleResendOTP} className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors">
                                        Resend OTP
                                    </button>
                                )}
                            </div>

                            <button type="button" onClick={handleBackToForm} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors mx-auto">
                                <HiArrowLeft className="w-4 h-4" />
                                Back to registration
                            </button>
                        </form>
                    )}
                </div>

                {step === 'form' && (
                    <p className="mt-8 text-center text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                            Sign in
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Register;
