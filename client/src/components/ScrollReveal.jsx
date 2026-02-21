import { useEffect, useRef } from 'react';

/**
 * Wrapper component for scroll-reveal animations.
 * Wraps children in a div that fades/slides in when scrolled into view.
 *
 * Props:
 *  - direction: 'up' | 'down' | 'left' | 'right' (default 'up')
 *  - delay: CSS delay in ms (default 0)
 *  - duration: CSS duration in ms (default 600)
 *  - distance: translate distance in px (default 30)
 *  - className: extra classes
 *  - once: animate only once (default true)
 */
const ScrollReveal = ({
    children,
    direction = 'up',
    delay = 0,
    duration = 600,
    distance = 30,
    className = '',
    once = true,
    ...rest
}) => {
    const ref = useRef(null);

    const getTransform = () => {
        switch (direction) {
            case 'down': return `translateY(-${distance}px)`;
            case 'left': return `translateX(${distance}px)`;
            case 'right': return `translateX(-${distance}px)`;
            case 'up':
            default: return `translateY(${distance}px)`;
        }
    };

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        // Set initial hidden state
        node.style.opacity = '0';
        node.style.transform = getTransform();
        node.style.transition = `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    node.style.opacity = '1';
                    node.style.transform = 'translateY(0) translateX(0)';
                    if (once) observer.unobserve(node);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        observer.observe(node);

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div ref={ref} className={className} {...rest}>
            {children}
        </div>
    );
};

export default ScrollReveal;
