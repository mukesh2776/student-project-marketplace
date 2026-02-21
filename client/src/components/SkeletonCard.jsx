/**
 * Skeleton shimmer loading card — looks like a ProjectCard while data loads.
 * Used in place of the plain spinner for a premium loading experience.
 */
const SkeletonCard = () => {
    return (
        <div className="glass-card overflow-hidden">
            {/* Thumbnail skeleton */}
            <div className="h-48 skeleton-shimmer" />

            {/* Content skeleton */}
            <div className="p-5 space-y-4">
                {/* Title */}
                <div className="h-5 w-3/4 rounded-lg skeleton-shimmer" />

                {/* Description lines */}
                <div className="space-y-2">
                    <div className="h-3 w-full rounded skeleton-shimmer" />
                    <div className="h-3 w-5/6 rounded skeleton-shimmer" />
                </div>

                {/* Tags */}
                <div className="flex gap-2">
                    <div className="h-6 w-16 rounded-full skeleton-shimmer" />
                    <div className="h-6 w-20 rounded-full skeleton-shimmer" />
                    <div className="h-6 w-14 rounded-full skeleton-shimmer" />
                </div>

                {/* Stats row */}
                <div className="flex gap-4">
                    <div className="h-4 w-12 rounded skeleton-shimmer" />
                    <div className="h-4 w-12 rounded skeleton-shimmer" />
                    <div className="h-4 w-12 rounded skeleton-shimmer" />
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full skeleton-shimmer" />
                        <div className="h-4 w-20 rounded skeleton-shimmer" />
                    </div>
                    <div className="h-9 w-24 rounded-lg skeleton-shimmer" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
