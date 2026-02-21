import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// Helper to get the current user's cart key
const getCartKey = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            return `cart_${user._id}`;
        } catch {
            return null;
        }
    }
    return null;
};

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        const key = getCartKey();
        if (key) {
            const savedCart = localStorage.getItem(key);
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });

    // Sync cart to localStorage whenever items or user changes
    useEffect(() => {
        const key = getCartKey();
        if (key) {
            localStorage.setItem(key, JSON.stringify(items));
        }
    }, [items]);

    // Listen for user changes (login/logout) and reload cart
    useEffect(() => {
        const handleStorageChange = () => {
            const key = getCartKey();
            if (key) {
                const savedCart = localStorage.getItem(key);
                setItems(savedCart ? JSON.parse(savedCart) : []);
            } else {
                setItems([]);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addToCart = (project) => {
        const exists = items.find(item => item._id === project._id);
        if (exists) {
            toast.error('Project already in cart');
            return false;
        }
        setItems([...items, project]);
        toast.success('Added to cart');
        return true;
    };

    const removeFromCart = (projectId) => {
        setItems(items.filter(item => item._id !== projectId));
        toast.success('Removed from cart');
    };

    const clearCart = () => {
        setItems([]);
        const key = getCartKey();
        if (key) {
            localStorage.removeItem(key);
        }
    };

    const isInCart = (projectId) => {
        return items.some(item => item._id === projectId);
    };

    const getTotal = () => {
        return items.reduce((total, item) => total + item.price, 0);
    };

    const getCommission = () => {
        return getTotal() * 0.10; // 10% commission
    };

    // Called when user logs in — reload their cart
    const reloadCart = () => {
        const key = getCartKey();
        if (key) {
            const savedCart = localStorage.getItem(key);
            setItems(savedCart ? JSON.parse(savedCart) : []);
        } else {
            setItems([]);
        }
    };

    const value = {
        items,
        itemCount: items.length,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        getTotal,
        getCommission,
        reloadCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
