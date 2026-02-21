import { HiStar } from 'react-icons/hi';

const StarRating = ({
    rating = 0,
    maxStars = 5,
    size = 'md',
    showValue = true,
    interactive = false,
    onChange
}) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8',
    };

    const handleClick = (index) => {
        if (interactive && onChange) {
            onChange(index + 1);
        }
    };

    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {[...Array(maxStars)].map((_, index) => {
                    const filled = index < Math.floor(rating);
                    const partial = index === Math.floor(rating) && rating % 1 !== 0;

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleClick(index)}
                            disabled={!interactive}
                            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                        >
                            <HiStar
                                className={`${sizes[size]} ${filled
                                    ? 'text-yellow-500'
                                    : partial
                                        ? 'text-yellow-500/50'
                                        : 'text-gray-300'
                                    }`}
                            />
                        </button>
                    );
                })}
            </div>
            {showValue && (
                <span className="text-gray-500 text-sm ml-1">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;
