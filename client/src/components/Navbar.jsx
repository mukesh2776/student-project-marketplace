import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
    HiMenu,
    HiX,
    HiShoppingCart,
    HiUser,
    HiLogout,
    HiViewGrid,
    HiUpload,
    HiSearch,
    HiCreditCard,
    HiShieldCheck
} from 'react-icons/hi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { itemCount, clearCart } = useCart();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        clearCart();
        logout();
        navigate('/');
        setShowUserMenu(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-nav">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 hidden sm:block">
                            Student<span className="text-gradient">Market</span>
                        </span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field pl-10 py-2 bg-gray-50"
                            />
                        </div>
                    </form>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            to="/projects"
                            className="text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 font-medium"
                        >
                            Browse
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/upload"
                                    className="text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 flex items-center gap-2 font-medium"
                                >
                                    <HiUpload className="w-4 h-4" />
                                    Sell
                                </Link>

                                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                                    <HiShoppingCart className="w-6 h-6" />
                                    {itemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                                            {itemCount}
                                        </span>
                                    )}
                                </Link>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <span className="text-white font-semibold text-sm">
                                                    {user?.name?.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    </button>

                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 py-2 shadow-card-hover">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-gray-900 font-medium truncate">{user?.name}</p>
                                                <p className="text-gray-500 text-sm truncate">{user?.email}</p>
                                            </div>
                                            <Link
                                                to="/dashboard"
                                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <HiViewGrid className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/banking"
                                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <HiCreditCard className="w-4 h-4" />
                                                Banking
                                            </Link>
                                            {user?.role === 'admin' && (
                                                <Link
                                                    to="/admin"
                                                    className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <HiShieldCheck className="w-4 h-4" />
                                                    Admin Panel
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <HiLogout className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary text-sm"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                    >
                        {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden py-4 space-y-2 border-t border-gray-100">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="relative">
                                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input-field pl-10 py-2 bg-gray-50"
                                />
                            </div>
                        </form>

                        <Link
                            to="/projects"
                            className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Browse Projects
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/upload"
                                    className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sell a Project
                                </Link>
                                <Link
                                    to="/cart"
                                    className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cart ({itemCount})
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/banking"
                                    className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Banking Details
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="block px-4 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        🛡️ Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-4 py-2 btn-primary text-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
