import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    verifyRegisterOTP: (data) => api.post('/auth/verify-register', data),
    verifyLoginOTP: (data) => api.post('/auth/verify-login', data),
    resendOTP: (data) => api.post('/auth/resend-otp', data),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    getSellerProfile: (id) => api.get(`/auth/seller/${id}`),
    updateRole: (role) => api.put('/auth/role', { role }),
    deleteAccount: () => api.delete('/auth/account'),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    verifyForgotPasswordOTP: (data) => api.post('/auth/verify-forgot-password', data),
    resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Projects API
export const projectsAPI = {
    getAll: (params) => api.get('/projects', { params }),
    getFeatured: () => api.get('/projects/featured'),
    getById: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`),
    getMyListings: () => api.get('/projects/user/my-listings'),
    getByCategory: (category) => api.get(`/projects/category/${category}`),
    getSimilar: (id) => api.get(`/projects/${id}/similar`),
};

// Orders API
export const ordersAPI = {
    create: (data) => api.post('/orders', data),
    getMyPurchases: () => api.get('/orders/my-purchases'),
    getMySales: () => api.get('/orders/my-sales'),
    getById: (id) => api.get(`/orders/${id}`),
    download: (id) => api.get(`/orders/${id}/download`),
    getStats: () => api.get('/orders/stats'),
};

// Reviews API
export const reviewsAPI = {
    create: (data) => api.post('/reviews', data),
    getByProject: (projectId, params) => api.get(`/reviews/project/${projectId}`, { params }),
    update: (id, data) => api.put(`/reviews/${id}`, data),
    delete: (id) => api.delete(`/reviews/${id}`),
    getMyReviews: () => api.get('/reviews/my-reviews'),
};

// Upload API
export const uploadAPI = {
    image: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    project: (file) => {
        const formData = new FormData();
        formData.append('project', file);
        return api.post('/upload/project', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};

// Banking API
export const bankingAPI = {
    get: () => api.get('/banking'),
    upsert: (data) => api.put('/banking', data),
    delete: () => api.delete('/banking'),
    status: () => api.get('/banking/status'),
};

// Admin API
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getUsers: (params) => api.get('/admin/users', { params }),
    getOrders: (params) => api.get('/admin/orders', { params }),
    getProjects: (params) => api.get('/admin/projects', { params }),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    deleteProject: (id) => api.delete(`/admin/projects/${id}`),
};

// Promo Codes API
export const promoCodesAPI = {
    create: (data) => api.post('/promo-codes', data),
    getMyCodes: () => api.get('/promo-codes/my-codes'),
    delete: (id) => api.delete(`/promo-codes/${id}`),
    validate: (data) => api.post('/promo-codes/validate', data),
};

export default api;
