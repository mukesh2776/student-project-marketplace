import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsAPI, reviewsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import StarRating from '../components/StarRating';
import Loading from '../components/Loading';
import ProjectCard from '../components/ProjectCard';
import toast from 'react-hot-toast';
import {
    HiShoppingCart,
    HiExternalLink,
    HiCode,
    HiDownload,
    HiEye,
    HiStar,
    HiCheckCircle,
    HiPencil,
    HiTrash
} from 'react-icons/hi';
import { FaGithub, FaYoutube } from 'react-icons/fa';

const ProjectDetail = () => {
    const { id } = useParams();
    const { addToCart, isInCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const [project, setProject] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [similarProjects, setSimilarProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [reviewForm, setReviewForm] = useState({ rating: 0, title: '', comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const inCart = project ? isInCart(project._id) : false;
    const isOwnProject = user && project?.seller?._id === user._id;

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            try {
                const [projectRes, reviewsRes, similarRes] = await Promise.all([
                    projectsAPI.getById(id),
                    reviewsAPI.getByProject(id),
                    projectsAPI.getSimilar(id),
                ]);
                setProject(projectRes.data);
                setReviews(reviewsRes.data.reviews || []);
                setSimilarProjects(similarRes.data || []);
            } catch (error) {
                console.error('Error fetching project:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    // Check if user already reviewed this project
    const userReview = reviews.find(r => r.user?._id === user?._id);
    const canReview = isAuthenticated && !isOwnProject && !userReview;

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (reviewForm.rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        if (!reviewForm.comment.trim()) {
            toast.error('Please write a comment');
            return;
        }

        setSubmittingReview(true);
        try {
            if (editingReviewId) {
                const res = await reviewsAPI.update(editingReviewId, {
                    rating: reviewForm.rating,
                    title: reviewForm.title,
                    comment: reviewForm.comment
                });
                setReviews(reviews.map(r => r._id === editingReviewId ? res.data : r));
                toast.success('Review updated!');
                setEditingReviewId(null);
            } else {
                const res = await reviewsAPI.create({
                    projectId: id,
                    rating: reviewForm.rating,
                    title: reviewForm.title,
                    comment: reviewForm.comment
                });
                setReviews([res.data, ...reviews]);
                toast.success('Review submitted!');
            }
            setReviewForm({ rating: 0, title: '', comment: '' });
            setShowReviewForm(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleEditReview = (review) => {
        setReviewForm({
            rating: review.rating,
            title: review.title || '',
            comment: review.comment
        });
        setEditingReviewId(review._id);
        setShowReviewForm(true);
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await reviewsAPI.delete(reviewId);
            setReviews(reviews.filter(r => r._id !== reviewId));
            toast.success('Review deleted!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete review');
        }
    };

    const handleCancelReview = () => {
        setReviewForm({ rating: 0, title: '', comment: '' });
        setEditingReviewId(null);
        setShowReviewForm(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading text="Loading project details..." />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
                    <p className="text-gray-500 mb-6">The project you're looking for doesn't exist.</p>
                    <Link to="/projects">
                        <Button>Browse Projects</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const formatCategory = (cat) => {
        return cat?.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ') || 'Other';
    };

    const images = project.images?.length > 0
        ? project.images
        : [project.thumbnail || 'https://via.placeholder.com/800x400?text=Project'];

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="text-sm mb-6">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-gray-900">Home</Link></li>
                        <li>/</li>
                        <li><Link to="/projects" className="hover:text-gray-900">Projects</Link></li>
                        <li>/</li>
                        <li className="text-gray-900 truncate">{project.title}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <div className="glass-card overflow-hidden">
                            <img
                                src={images[activeImage]}
                                alt={project.title}
                                className="w-full h-64 sm:h-96 object-cover"
                            />
                            {images.length > 1 && (
                                <div className="p-4 flex gap-2 overflow-x-auto">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(index)}
                                            className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${activeImage === index ? 'border-primary-500' : 'border-gray-200'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Project Info */}
                        <div className="glass-card p-6">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="tag">{formatCategory(project.category)}</span>
                                <div className="flex items-center gap-1 text-gray-500">
                                    <HiEye className="w-4 h-4" />
                                    <span className="text-sm">{project.views} views</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400">
                                    <HiDownload className="w-4 h-4" />
                                    <span className="text-sm">{project.downloads} downloads</span>
                                </div>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                {project.title}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                <StarRating rating={project.rating || 0} />
                                <span className="text-gray-500 text-sm">
                                    ({project.totalReviews || 0} reviews)
                                </span>
                            </div>

                            <p className="text-gray-600 mb-6 whitespace-pre-line">
                                {project.description}
                            </p>

                            {/* Tech Stack */}
                            <div className="mb-6">
                                <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                                    <HiCode className="w-5 h-5 text-primary-400" />
                                    Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack?.map((tech, index) => (
                                        <span key={index} className="tag">{tech}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            {project.features?.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-gray-900 font-semibold mb-3">Features</h3>
                                    <ul className="space-y-2">
                                        {project.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2 text-gray-600">
                                                <HiCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Links */}
                            <div className="flex flex-wrap gap-3">
                                {project.demoUrl && (
                                    <a
                                        href={project.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-secondary flex items-center gap-2 text-sm"
                                    >
                                        <HiExternalLink className="w-4 h-4" />
                                        Live Demo
                                    </a>
                                )}
                                {project.videoUrl && (
                                    <a
                                        href={project.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-secondary flex items-center gap-2 text-sm"
                                    >
                                        <FaYoutube className="w-4 h-4" />
                                        Video
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Reviews ({reviews.length})
                                </h3>
                                {canReview && !showReviewForm && (
                                    <Button
                                        size="sm"
                                        onClick={() => setShowReviewForm(true)}
                                        leftIcon={<HiPencil className="w-4 h-4" />}
                                    >
                                        Write a Review
                                    </Button>
                                )}
                            </div>

                            {/* Review Form */}
                            {showReviewForm && (
                                <form onSubmit={handleReviewSubmit} className="mb-8 p-5 rounded-xl bg-gray-50 border border-gray-200">
                                    <h4 className="text-gray-900 font-semibold mb-4">
                                        {editingReviewId ? 'Edit Your Review' : 'Write a Review'}
                                    </h4>

                                    {/* Star Rating */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                                        <StarRating
                                            rating={reviewForm.rating}
                                            interactive={true}
                                            onChange={(val) => setReviewForm(prev => ({ ...prev, rating: val }))}
                                            size="lg"
                                        />
                                    </div>

                                    {/* Title */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title (optional)</label>
                                        <input
                                            type="text"
                                            value={reviewForm.title}
                                            onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="Summarize your experience"
                                            maxLength={100}
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Comment */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Comment *</label>
                                        <textarea
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                            placeholder="Share your experience with this project..."
                                            rows={4}
                                            maxLength={1000}
                                            required
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                        />
                                        <p className="text-gray-500 text-xs mt-1">{reviewForm.comment.length}/1000</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button type="submit" loading={submittingReview}>
                                            {editingReviewId ? 'Update Review' : 'Submit Review'}
                                        </Button>
                                        <Button type="button" variant="ghost" onClick={handleCancelReview}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-semibold">
                                                        {review.user?.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-900 font-medium">{review.user?.name}</span>
                                                            {review.isVerifiedPurchase && (
                                                                <span className="text-xs text-green-400 flex items-center gap-1">
                                                                    <HiCheckCircle className="w-3 h-3" />
                                                                    Verified Purchase
                                                                </span>
                                                            )}
                                                        </div>
                                                        {/* Edit/Delete for own reviews */}
                                                        {user && review.user?._id === user._id && (
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => handleEditReview(review)}
                                                                    className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                                                                    title="Edit review"
                                                                >
                                                                    <HiPencil className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteReview(review._id)}
                                                                    className="p-1.5 text-red-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                                                    title="Delete review"
                                                                >
                                                                    <HiTrash className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <StarRating rating={review.rating} size="sm" showValue={false} />
                                                    {review.title && (
                                                        <p className="text-gray-900 font-medium mt-2">{review.title}</p>
                                                    )}
                                                    <p className="text-gray-600 mt-1">{review.comment}</p>
                                                    <p className="text-gray-500 text-xs mt-2">
                                                        {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">
                                    No reviews yet. Be the first to review!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Price Card */}
                        <div className="glass-card p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <div className="text-4xl font-bold text-gradient mb-2">
                                    ₹{project.price?.toLocaleString()}
                                </div>
                                <p className="text-gray-500 text-sm">One-time purchase</p>
                            </div>

                            <div className="space-y-3 mb-6">
                                {isOwnProject ? (
                                    <div className="text-center py-3 px-4 rounded-lg bg-blue-50 text-blue-600 font-medium border border-blue-200">
                                        This is your project
                                    </div>
                                ) : (
                                    <>
                                        <Button
                                            fullWidth
                                            leftIcon={<HiShoppingCart className="w-5 h-5" />}
                                            onClick={() => addToCart(project)}
                                            disabled={inCart}
                                        >
                                            {inCart ? 'Already in Cart' : 'Add to Cart'}
                                        </Button>

                                        {isAuthenticated ? (
                                            <Link to="/cart">
                                                <Button variant="secondary" fullWidth>
                                                    Buy Now
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link to="/login">
                                                <Button variant="secondary" fullWidth>
                                                    Login to Buy
                                                </Button>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>


                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2 text-gray-600">
                                    <HiCheckCircle className="w-4 h-4 text-green-400" />
                                    Full source code included
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <HiCheckCircle className="w-4 h-4 text-green-400" />
                                    Documentation included
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <HiCheckCircle className="w-4 h-4 text-green-400" />
                                    Lifetime access
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <HiCheckCircle className="w-4 h-4 text-green-400" />
                                    Free updates
                                </li>
                            </ul>
                        </div>

                        {/* Seller Card */}
                        <div className="glass-card p-6">
                            <h3 className="text-gray-900 font-semibold mb-4">About the Seller</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center">
                                    {project.seller?.avatar ? (
                                        <img
                                            src={project.seller.avatar}
                                            alt={project.seller.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white text-xl font-semibold">
                                            {project.seller?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-gray-900 font-medium">{project.seller?.name}</p>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <HiStar className="w-4 h-4 text-yellow-500" />
                                        {project.seller?.rating?.toFixed(1) || '0.0'} rating
                                    </div>
                                </div>
                            </div>
                            {project.seller?.bio && (
                                <p className="text-gray-500 text-sm mb-4">{project.seller.bio}</p>
                            )}
                            <p className="text-sm text-gray-500">
                                {project.seller?.totalSales || 0} projects sold
                            </p>
                        </div>
                    </div>
                </div>

                {/* Similar Projects */}
                {similarProjects.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {similarProjects.map((p) => (
                                <ProjectCard key={p._id} project={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default ProjectDetail;
