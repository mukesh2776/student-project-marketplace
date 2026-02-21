import { useState, useEffect } from 'react';
import { HiArrowUp } from 'react-icons/hi';

/**
 * Floating scroll-to-top button. Appears after scrolling 400px down.
 */
const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`scroll-to-top-btn ${visible ? 'scroll-to-top-visible' : ''}`}
        >
            <HiArrowUp className="w-5 h-5" />
        </button>
    );
};

export default ScrollToTop;
