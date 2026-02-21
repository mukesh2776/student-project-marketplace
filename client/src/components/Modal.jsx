import { useEffect } from 'react';
import { HiX } from 'react-icons/hi';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showClose = true
}) => {
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4',
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full ${sizes[size]} bg-white rounded-2xl border border-gray-200 shadow-card-hover p-6 m-4 animate-fade-in`}>
                {/* Header */}
                {(title || showClose) && (
                    <div className="flex items-center justify-between mb-4">
                        {title && (
                            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        )}
                        {showClose && (
                            <button
                                onClick={onClose}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                            >
                                <HiX className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                {children}
            </div>
        </div>
    );
};

export default Modal;
