import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { HiHome, HiSearch } from 'react-icons/hi';

const NotFound = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="text-center max-w-lg">
                {/* Animated 404 */}
                <div className="relative mb-8">
                    <h1 className="text-[150px] sm:text-[200px] font-black text-gray-100 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl animate-bounce-slow">🚀</div>
                    </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Lost in Space
                </h2>
                <p className="text-gray-500 mb-8 text-lg">
                    Oops! The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/">
                        <Button
                            size="lg"
                            leftIcon={<HiHome className="w-5 h-5" />}
                        >
                            Go Home
                        </Button>
                    </Link>
                    <Link to="/projects">
                        <Button
                            variant="secondary"
                            size="lg"
                            leftIcon={<HiSearch className="w-5 h-5" />}
                        >
                            Browse Projects
                        </Button>
                    </Link>
                </div>

                {/* Floating decorative elements */}
                <div className="relative mt-12">
                    <div className="absolute -top-6 left-1/4 w-3 h-3 bg-primary-400 rounded-full animate-float opacity-60" />
                    <div className="absolute -top-10 right-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-float-delayed opacity-60" />
                    <div className="absolute -top-4 right-1/4 w-4 h-4 bg-purple-300 rounded-full animate-float opacity-40" />
                </div>
            </div>
        </div>
    );
};

export default NotFound;
