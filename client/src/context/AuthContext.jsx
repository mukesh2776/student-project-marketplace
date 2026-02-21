import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const response = await authAPI.getProfile();
                    setUser(response.data);
                } catch (error) {
                    console.error('Auth init error:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, [token]);

    // Step 1: send credentials → returns { step: 'otp', email } for regular users
    // or { token, _id, name, email, role, ... } for admin (skips OTP)
    const login = async (email, password) => {
        const response = await authAPI.login({ email, password });
        const data = response.data;

        // Admin login returns token directly (no OTP step)
        if (data.token) {
            localStorage.setItem('token', data.token);
            const { token: newToken, ...userData } = data;
            localStorage.setItem('user', JSON.stringify(userData));
            setToken(newToken);
            setUser(userData);
        }

        return data;
    };

    // Step 2: verify OTP → sets token + user
    const verifyLoginOTP = async (email, otp) => {
        const response = await authAPI.verifyLoginOTP({ email, otp });
        const { token: newToken, ...userData } = response.data;

        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);

        return userData;
    };

    // Step 1: send registration data → returns { step: 'otp', email }
    const register = async (name, email, password, role) => {
        const response = await authAPI.register({ name, email, password, role });
        return response.data; // { step: 'otp', email, message }
    };

    // Step 2: verify OTP → sets token + user
    const verifyRegisterOTP = async (email, otp) => {
        const response = await authAPI.verifyRegisterOTP({ email, otp });
        const { token: newToken, ...userData } = response.data;

        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);

        return userData;
    };

    // Resend OTP
    const resendOTP = async (email, purpose) => {
        const response = await authAPI.resendOTP({ email, purpose });
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isSeller: user?.role === 'seller' || user?.role === 'both',
        isBuyer: user?.role === 'buyer' || user?.role === 'both',
        login,
        verifyLoginOTP,
        register,
        verifyRegisterOTP,
        resendOTP,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
