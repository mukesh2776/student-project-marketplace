import { Link } from 'react-router-dom';
import { HiStar, HiEye, HiDownload, HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { resolveImageUrl } from '../utils/imageUrl';

const ProjectCard = ({ project }) => {
    const { addToCart, isInCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const inCart = isInCart(project._id);
    const wishlisted = isInWishlist(project._id);

    const categoryColors = {
        'web-development': 'bg-blue-50 text-blue-600 border-blue-200',
        'mobile-app': 'bg-green-50 text-green-600 border-green-200',
        'machine-learning': 'bg-purple-50 text-purple-600 border-purple-200',
        'data-science': 'bg-orange-50 text-orange-600 border-orange-200',
        'blockchain': 'bg-yellow-50 text-yellow-700 border-yellow-200',
        'iot': 'bg-cyan-50 text-cyan-600 border-cyan-200',
        'game-development': 'bg-pink-50 text-pink-600 border-pink-200',
        'desktop-app': 'bg-indigo-50 text-indigo-600 border-indigo-200',
        'api': 'bg-red-50 text-red-600 border-red-200',
        'other': 'bg-gray-50 text-gray-600 border-gray-200',
    };

    const formatCategory = (cat) => {
        return cat?.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ') || 'Other';
    };

    return (
        <Link to={`/projects/${project._id}`}>
            <div className="glass-card card-hover overflow-hidden group">
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={resolveImageUrl(project.thumbnail)}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {/* Category Badge */}
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[project.category] || categoryColors['other']}`}>
                        {formatCategory(project.category)}
                    </span>

                    {/* Wishlist Heart */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(project);
                        }}
                        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${wishlisted
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110'
                            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500 backdrop-blur-sm'
                            }`}
                    >
                        {wishlisted ? (
                            <HiHeart className="w-5 h-5" />
                        ) : (
                            <HiOutlineHeart className="w-5 h-5" />
                        )}
                    </button>

                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3 bg-gradient-primary px-4 py-1.5 rounded-full">
                        <span className="text-white font-bold">₹{project.price?.toLocaleString()}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <Link to={`/projects/${project._id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-primary-500 transition-colors">
                            {project.title}
                        </h3>
                    </Link>

                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {project.shortDescription || project.description}
                    </p>

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack?.slice(0, 3).map((tech, index) => (
                            <span key={index} className="tag">
                                {tech}
                            </span>
                        ))}
                        {project.techStack?.length > 3 && (
                            <span className="tag">+{project.techStack.length - 3}</span>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                            <HiStar className="w-4 h-4 text-yellow-500" />
                            <span>{project.rating?.toFixed(1) || '0.0'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <HiEye className="w-4 h-4" />
                            <span>{project.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <HiDownload className="w-4 h-4" />
                            <span>{project.downloads || 0}</span>
                        </div>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                                {project.seller?.avatar ? (
                                    <img
                                        src={project.seller.avatar}
                                        alt={project.seller.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white text-xs font-semibold">
                                        {project.seller?.name?.charAt(0).toUpperCase() || 'S'}
                                    </span>
                                )}
                            </div>
                            <span className="text-gray-500 text-sm truncate max-w-24">
                                {project.seller?.name || 'Seller'}
                            </span>
                        </div>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (!inCart) addToCart(project);
                            }}
                            disabled={inCart}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${inCart
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                                }`}
                        >
                            {inCart ? 'In Cart' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;
