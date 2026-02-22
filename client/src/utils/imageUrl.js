/**
 * Resolves image URLs for display.
 * - Cloudinary URLs (https://...) are returned as-is
 * - Old local paths (/uploads/...) are prefixed with the backend URL
 * - Empty/null values return a placeholder
 */
const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || '';

export const resolveImageUrl = (url, placeholder = 'https://via.placeholder.com/400x200?text=Project') => {
    if (!url) return placeholder;

    // Already an absolute URL (Cloudinary or other)
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // Old relative path — prepend backend URL
    if (url.startsWith('/uploads/')) {
        return `${API_BASE}${url}`;
    }

    return url;
};
