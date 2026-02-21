import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    type = 'text',
    error,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = true,
    className = '',
    ...props
}, ref) => {
    return (
        <div className={`${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {leftIcon}
                    </span>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={`
            input-field
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''}
            ${className}
          `}
                    {...props}
                />
                {rightIcon && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {rightIcon}
                    </span>
                )}
            </div>
            {(error || helperText) && (
                <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
