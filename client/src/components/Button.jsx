const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    leftIcon,
    rightIcon,
    onClick,
    type = 'button',
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow hover:shadow-glow hover:-translate-y-0.5',
        secondary: 'bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-50',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
        success: 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100',
        cyan: 'bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm gap-1.5',
        md: 'px-6 py-3 text-base gap-2',
        lg: 'px-8 py-4 text-lg gap-2.5',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            ) : (
                <>
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </>
            )}
        </button>
    );
};

export default Button;
