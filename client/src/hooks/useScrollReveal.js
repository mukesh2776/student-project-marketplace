import { useEffect, useRef } from 'react';

/**
 * Custom hook that adds scroll-reveal animation to elements.
 * Uses IntersectionObserver — no external library needed.
 *
 * @param {Object} options
 * @param {number} options.threshold - Visibility threshold (0-1), default 0.1
 * @param {string} options.rootMargin - Root margin, default '0px 0px -50px 0px'
 * @param {boolean} options.once - Animate only once, default true
 * @returns {React.RefObject} ref to attach to the element
 */
const useScrollReveal = ({
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true,
} = {}) => {
    const ref = useRef(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        // Start hidden
        node.classList.add('scroll-hidden');

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    node.classList.remove('scroll-hidden');
                    node.classList.add('scroll-reveal');
                    if (once) observer.unobserve(node);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return ref;
};

export default useScrollReveal;
