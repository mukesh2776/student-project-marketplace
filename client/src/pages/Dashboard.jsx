import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, projectsAPI, authAPI, bankingAPI, promoCodesAPI } from '../services/api';
import Button from '../components/Button';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';
import {
    HiCurrencyDollar,
    HiShoppingCart,
    HiUpload,
    HiEye,
    HiPencil,
    HiTrash,
    HiDownload,
    HiTrendingUp,
    HiCog,
    HiExclamation,
    HiCreditCard,
    HiTicket,
    HiPlus
} from 'react-icons/hi';

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, isAuthenticated, logout, updateUser, isSeller } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [myListings, setMyListings] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentRole, setCurrentRole] = useState(user?.role || 'both');
    const [updatingRole, setUpdatingRole] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [bankingStatus, setBankingStatus] = useState(null);

    // Promo code states
    const [promoCodes, setPromoCodes] = useState([]);
    const [promoLoading, setPromoLoading] = useState(false);
    const [showPromoForm, setShowPromoForm] = useState(false);
    const [promoForm, setPromoForm] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        project: '',
        usageLimit: '',
        expiresAt: ''
    });

    // Handle tab from URL query param
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['overview', 'listings', 'purchases', 'sales', 'banking', 'promo-codes', 'settings'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    // Fetch promo codes when tab is active
    useEffect(() => {
        if (activeTab === 'promo-codes' && isSeller) {
            fetchPromoCodes();
        }
    }, [activeTab, isSeller]);

    const fetchPromoCodes = async () => {
        setPromoLoading(true);
        try {
            const res = await promoCodesAPI.getMyCodes();
            setPromoCodes(res.data);
        } catch (error) {
            toast.error('Failed to load promo codes');
        } finally {
            setPromoLoading(false);
        }
    };

    const handleCreatePromo = async (e) => {
        e.preventDefault();
        if (!promoForm.code || !promoForm.discountValue) {
            toast.error('Code and discount value are required');
            return;
        }
        try {
            await promoCodesAPI.create({
                ...promoForm,
                discountValue: Number(promoForm.discountValue),
                usageLimit: promoForm.usageLimit ? Number(promoForm.usageLimit) : 0,
                project: promoForm.project || null,
                expiresAt: promoForm.expiresAt || null
            });
            toast.success('Promo code created!');
            setShowPromoForm(false);
            setPromoForm({ code: '', discountType: 'percentage', discountValue: '', project: '', usageLimit: '', expiresAt: '' });
            fetchPromoCodes();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create promo code');
        }
    };

    const handleDeletePromo = async (id) => {
        if (!window.confirm('Are you sure you want to delete this promo code?')) return;
        try {
            await promoCodesAPI.delete(id);
            toast.success('Promo code deleted');
            setPromoCodes(promoCodes.filter(p => p._id !== id));
        } catch (error) {
            toast.error('Failed to delete promo code');
        }
    };

    // Handle role change
    const handleRoleChange = async (newRole) => {
        setUpdatingRole(true);
        try {
            const response = await authAPI.updateRole(newRole);
            setCurrentRole(newRole);
            // Update the user in AuthContext so isSeller/isBuyer updates globally
            updateUser({ ...user, role: newRole });
            toast.success(`Role updated to ${newRole}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update role');
        } finally {
            setUpdatingRole(false);
        }
    };

    // Handle account deletion
    const handleDeleteAccount = async () => {
        setDeletingAccount(true);
        try {
            await authAPI.deleteAccount();
            toast.success('Account deleted successfully');
            logout();
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete account');
        } finally {
            setDeletingAccount(false);
            setShowDeleteModal(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [statsRes, listingsRes, purchasesRes] = await Promise.all([
                    ordersAPI.getStats(),
                    projectsAPI.getMyListings(),
                    ordersAPI.getMyPurchases(),
                ]);
                setStats(statsRes.data);
                setMyListings(listingsRes.data);
                setPurchases(purchasesRes.data);

                // Fetch banking status
                try {
                    const bankingRes = await bankingAPI.status();
                    setBankingStatus(bankingRes.data);
                } catch (err) {
                    setBankingStatus({ hasBankingDetails: false, isVerified: false });
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading text="Loading dashboard..." />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Earnings',
            value: `₹${stats?.sales?.totalEarnings?.toLocaleString() || 0}`,
            icon: HiCurrencyDollar,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Projects Sold',
            value: stats?.sales?.total || 0,
            icon: HiTrendingUp,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Total Purchases',
            value: stats?.purchases?.total || 0,
            icon: HiShoppingCart,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Active Listings',
            value: myListings.length,
            icon: HiUpload,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'listings', label: 'My Listings' },
        { id: 'purchases', label: 'Purchases' },
        { id: 'sales', label: 'Sales' },
        { id: 'banking', label: 'Banking' },
        ...(isSeller ? [{ id: 'promo-codes', label: 'Promo Codes' }] : []),
        { id: 'settings', label: 'Settings' },
    ];

    const roles = [
        { value: 'buyer', label: 'Buyer', description: 'Only browse and purchase projects' },
        { value: 'seller', label: 'Seller', description: 'Only sell and list projects' },
        { value: 'both', label: 'Both', description: 'Buy and sell projects' },
    ];

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500">Welcome back, {user?.name}!</p>
                    </div>
                    {isSeller && (
                        <Link to="/upload">
                            <Button leftIcon={<HiUpload className="w-5 h-5" />}>
                                Upload Project
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <div key={index} className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                            <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Sales */}
                        <div className="glass-card p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Sales</h3>
                            {stats?.recentSales?.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recentSales.map((sale) => (
                                        <div key={sale._id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                                            <img
                                                src={sale.project?.thumbnail || 'https://via.placeholder.com/60'}
                                                alt={sale.project?.title}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-900 font-medium truncate">{sale.project?.title}</p>
                                                <p className="text-gray-500 text-sm">by {sale.buyer?.name}</p>
                                            </div>
                                            <p className="text-green-600 font-semibold">+₹{sale.sellerEarning}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No sales yet</p>
                            )}
                        </div>

                        {/* Recent Purchases */}
                        <div className="glass-card p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Purchases</h3>
                            {stats?.recentPurchases?.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recentPurchases.map((purchase) => (
                                        <div key={purchase._id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                                            <img
                                                src={purchase.project?.thumbnail || 'https://via.placeholder.com/60'}
                                                alt={purchase.project?.title}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-900 font-medium truncate">{purchase.project?.title}</p>
                                                <p className="text-gray-500 text-sm">₹{purchase.amount}</p>
                                            </div>
                                            <Button variant="ghost" size="sm" leftIcon={<HiDownload className="w-4 h-4" />}>
                                                Download
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No purchases yet</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'listings' && (
                    <div className="glass-card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">My Listings</h3>
                            <Link to="/upload">
                                <Button size="sm" leftIcon={<HiUpload className="w-4 h-4" />}>
                                    Add New
                                </Button>
                            </Link>
                        </div>
                        {myListings.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Project</th>
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Price</th>
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Views</th>
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Sales</th>
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                                            <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myListings.map((project) => (
                                            <tr key={project._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={project.thumbnail || 'https://via.placeholder.com/48'}
                                                            alt={project.title}
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                        />
                                                        <div>
                                                            <p className="text-gray-900 font-medium">{project.title}</p>
                                                            <p className="text-gray-500 text-sm">{project.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-gray-900">₹{project.price}</td>
                                                <td className="py-4 px-4 text-gray-500">{project.views}</td>
                                                <td className="py-4 px-4 text-gray-500">{project.downloads}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${project.isActive
                                                        ? 'bg-green-50 text-green-600 border border-green-200'
                                                        : 'bg-red-50 text-red-600 border border-red-200'
                                                        }`}>
                                                        {project.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link to={`/projects/${project._id}`}>
                                                            <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                                                                <HiEye className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <Link to={`/edit-project/${project._id}`}>
                                                            <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                                                                <HiPencil className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <button className="p-2 text-red-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                                                            <HiTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📦</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
                                <p className="text-gray-500 mb-6">Start selling by uploading your first project</p>
                                <Link to="/upload">
                                    <Button>Upload Project</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'purchases' && (
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">My Purchases</h3>
                        {purchases.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {purchases.map((order) => (
                                    <div key={order._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <img
                                            src={order.project?.thumbnail || 'https://via.placeholder.com/200'}
                                            alt={order.project?.title}
                                            className="w-full h-32 object-cover rounded-lg mb-4"
                                        />
                                        <h4 className="text-gray-900 font-medium mb-2">{order.project?.title}</h4>
                                        <p className="text-gray-500 text-sm mb-4">
                                            Purchased on {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                        <Button fullWidth size="sm" leftIcon={<HiDownload className="w-4 h-4" />}>
                                            Download ({order.maxDownloads - order.downloadCount} left)
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🛒</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No purchases yet</h3>
                                <p className="text-gray-500 mb-6">Browse projects to find something you like</p>
                                <Link to="/projects">
                                    <Button>Browse Projects</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'sales' && (
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Sales History</h3>
                        {stats?.recentSales?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Project</th>
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Buyer</th>
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Your Earning</th>
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentSales.map((sale) => (
                                            <tr key={sale._id} className="border-b border-gray-100">
                                                <td className="py-4 px-4 text-gray-900">{sale.project?.title}</td>
                                                <td className="py-4 px-4 text-gray-500">{sale.buyer?.name}</td>
                                                <td className="py-4 px-4 text-gray-900">₹{sale.amount}</td>
                                                <td className="py-4 px-4 text-green-600">₹{sale.sellerEarning}</td>
                                                <td className="py-4 px-4 text-gray-500">
                                                    {new Date(sale.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No sales yet</p>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-8">
                        {/* Role Settings */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <HiCog className="w-6 h-6 text-purple-400" />
                                <h3 className="text-xl font-bold text-gray-900">Account Role</h3>
                            </div>
                            <p className="text-gray-500 mb-6">Choose how you want to use the platform</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {roles.map((role) => (
                                    <button
                                        key={role.value}
                                        onClick={() => handleRoleChange(role.value)}
                                        disabled={updatingRole}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${currentRole === role.value
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                                            }`}
                                    >
                                        <p className="text-gray-900 font-semibold mb-1">{role.label}</p>
                                        <p className="text-gray-500 text-sm">{role.description}</p>
                                        {currentRole === role.value && (
                                            <span className="inline-block mt-2 text-xs text-purple-400">✓ Current</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="glass-card p-6 border border-red-200">
                            <div className="flex items-center gap-3 mb-4">
                                <HiExclamation className="w-6 h-6 text-red-500" />
                                <h3 className="text-xl font-bold text-red-500">Danger Zone</h3>
                            </div>
                            <p className="text-gray-500 mb-6">
                                Once you delete your account, there is no going back. All your projects and data will be permanently removed.
                            </p>
                            <Button
                                variant="ghost"
                                onClick={() => setShowDeleteModal(true)}
                                className="border-red-500 text-red-400 hover:bg-red-500/20"
                            >
                                Delete My Account
                            </Button>
                        </div>
                    </div>
                )}

                {activeTab === 'banking' && (
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                <HiCreditCard className="w-5 h-5 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Banking Details</h3>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bankingStatus?.hasBankingDetails ? 'bg-green-50' : 'bg-yellow-50'}`}>
                                    {bankingStatus?.hasBankingDetails ? (
                                        <HiCreditCard className="w-6 h-6 text-green-400" />
                                    ) : (
                                        <HiExclamation className="w-6 h-6 text-yellow-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-gray-900 font-semibold text-lg">
                                        {bankingStatus?.hasBankingDetails ? 'Banking details saved' : 'No banking details'}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {bankingStatus?.hasBankingDetails
                                            ? 'Your bank account is set up to receive payments from sales.'
                                            : 'Add your banking details to receive payments and make purchases.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Link to="/banking">
                            <Button leftIcon={<HiCreditCard className="w-5 h-5" />}>
                                {bankingStatus?.hasBankingDetails ? 'Manage Banking Details' : 'Add Banking Details'}
                            </Button>
                        </Link>
                    </div>
                )}

                {activeTab === 'promo-codes' && isSeller && (
                    <div className="glass-card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                                    <HiTicket className="w-5 h-5 text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Promo Codes</h3>
                            </div>
                            <Button
                                size="sm"
                                leftIcon={<HiPlus className="w-4 h-4" />}
                                onClick={() => setShowPromoForm(!showPromoForm)}
                            >
                                {showPromoForm ? 'Cancel' : 'Create Code'}
                            </Button>
                        </div>

                        {/* Create Form */}
                        {showPromoForm && (
                            <form onSubmit={handleCreatePromo} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4 border border-gray-200">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. SAVE20"
                                            value={promoForm.code}
                                            onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                                            className="input-field w-full"
                                            maxLength={20}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                                        <select
                                            value={promoForm.discountType}
                                            onChange={(e) => setPromoForm({ ...promoForm, discountType: e.target.value })}
                                            className="input-field w-full"
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (₹)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
                                        <input
                                            type="number"
                                            placeholder={promoForm.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 100'}
                                            value={promoForm.discountValue}
                                            onChange={(e) => setPromoForm({ ...promoForm, discountValue: e.target.value })}
                                            className="input-field w-full"
                                            min="1"
                                            max={promoForm.discountType === 'percentage' ? '100' : undefined}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">For Project (Optional)</label>
                                        <select
                                            value={promoForm.project}
                                            onChange={(e) => setPromoForm({ ...promoForm, project: e.target.value })}
                                            className="input-field w-full"
                                        >
                                            <option value="">All my projects</option>
                                            {myListings.map(p => (
                                                <option key={p._id} value={p._id}>{p.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (0 = unlimited)</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={promoForm.usageLimit}
                                            onChange={(e) => setPromoForm({ ...promoForm, usageLimit: e.target.value })}
                                            className="input-field w-full"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                                        <input
                                            type="date"
                                            value={promoForm.expiresAt}
                                            onChange={(e) => setPromoForm({ ...promoForm, expiresAt: e.target.value })}
                                            className="input-field w-full"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" leftIcon={<HiPlus className="w-4 h-4" />}>
                                    Create Promo Code
                                </Button>
                            </form>
                        )}

                        {/* Promo Codes Table */}
                        {promoLoading ? (
                            <div className="text-center py-8">
                                <Loading text="Loading promo codes..." />
                            </div>
                        ) : promoCodes.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Code</th>
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Discount</th>
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Project</th>
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Usage</th>
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Expires</th>
                                            <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {promoCodes.map((promo) => (
                                            <tr key={promo._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <span className="px-3 py-1 rounded-lg bg-yellow-50 text-yellow-700 font-mono font-bold text-sm border border-yellow-200">
                                                        {promo.code}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-gray-900">
                                                    {promo.discountType === 'percentage'
                                                        ? `${promo.discountValue}%`
                                                        : `₹${promo.discountValue}`}
                                                </td>
                                                <td className="py-4 px-4 text-gray-500">
                                                    {promo.project?.title || 'All projects'}
                                                </td>
                                                <td className="py-4 px-4 text-gray-500">
                                                    {promo.usedCount} / {promo.usageLimit || '∞'}
                                                </td>
                                                <td className="py-4 px-4 text-gray-500">
                                                    {promo.expiresAt
                                                        ? new Date(promo.expiresAt).toLocaleDateString()
                                                        : 'Never'}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <button
                                                        onClick={() => handleDeletePromo(promo._id)}
                                                        className="p-2 text-red-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                                                    >
                                                        <HiTrash className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🎟️</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No promo codes yet</h3>
                                <p className="text-gray-500 mb-6">Create promo codes to offer discounts on your projects</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                        <div className="glass-card p-6 max-w-md w-full">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                                    <HiExclamation className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account?</h3>
                                <p className="text-gray-500">
                                    This action cannot be undone. All your projects, sales data, and account information will be permanently deleted.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    fullWidth
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={deletingAccount}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    fullWidth
                                    onClick={handleDeleteAccount}
                                    loading={deletingAccount}
                                    className="bg-red-500 hover:bg-red-600"
                                >
                                    Yes, Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
