import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

// Helper to get the current user's wishlist key
const getWishlistKey = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            return `wishlist_${user._id}`;
        } catch {
            return null;
        }
    }
    return null;
};

export const WishlistProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        const key = getWishlistKey();
        if (key) {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    // Sync to localStorage
    useEffect(() => {
        const key = getWishlistKey();
        if (key) {
            localStorage.setItem(key, JSON.stringify(items));
        }
    }, [items]);

    const toggleWishlist = (project) => {
        const exists = items.find(item => item._id === project._id);
        if (exists) {
            setItems(items.filter(item => item._id !== project._id));
            toast.success('Removed from wishlist');
            return false;
        } else {
            setItems([...items, {
                _id: project._id,
                title: project.title,
                thumbnail: project.thumbnail,
                price: project.price,
                category: project.category,
                shortDescription: project.shortDescription || project.description,
                techStack: project.techStack,
                rating: project.rating,
                views: project.views,
                downloads: project.downloads,
                seller: project.seller,
            }]);
            toast.success('Added to wishlist');
            return true;
        }
    };

    const isInWishlist = (projectId) => {
        return items.some(item => item._id === projectId);
    };

    const removeFromWishlist = (projectId) => {
        setItems(items.filter(item => item._id !== projectId));
    };

    const clearWishlist = () => {
        setItems([]);
        const key = getWishlistKey();
        if (key) localStorage.removeItem(key);
    };

    // Reload on user change (login/logout)
    const reloadWishlist = () => {
        const key = getWishlistKey();
        if (key) {
            const saved = localStorage.getItem(key);
            setItems(saved ? JSON.parse(saved) : []);
        } else {
            setItems([]);
        }
    };

    const value = {
        items,
        itemCount: items.length,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        reloadWishlist,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export default WishlistContext;
