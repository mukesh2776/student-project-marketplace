import { useState, useEffect, useRef } from 'react';

/**
 * Animated counter that counts up from 0 to the target value when scrolled into view.
 *
 * Props:
 * - end: target number (e.g. 500)
 * - suffix: text after the number (e.g. '+')
 * - prefix: text before the number (e.g. '₹')
 * - duration: animation duration in ms (default 2000)
 */
const AnimatedCounter = ({ end, suffix = '', prefix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    animateCount();
                    observer.unobserve(node);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(node);
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasAnimated]);

    const animateCount = () => {
        const startTime = performance.now();
        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };
        requestAnimationFrame(step);
    };

    const formatNumber = (num) => {
        if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
        return num.toLocaleString('en-IN');
    };

    return (
        <span ref={ref}>
            {prefix}{formatNumber(count)}{suffix}
        </span>
    );
};

export default AnimatedCounter;
