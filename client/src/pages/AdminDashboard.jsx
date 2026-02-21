import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';
import {
    HiUsers,
    HiCurrencyDollar,
    HiShoppingCart,
    HiCollection,
    HiTrash,
    HiSearch,
    HiChevronLeft,
    HiChevronRight,
    HiExclamation,
    HiTrendingUp,
    HiCash
} from 'react-icons/hi';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    // Stats
    const [stats, setStats] = useState(null);

    // Users
    const [users, setUsers] = useState([]);
    const [usersPagination, setUsersPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [userSearch, setUserSearch] = useState('');

    // Orders
    const [orders, setOrders] = useState([]);
    const [ordersPagination, setOrdersPagination] = useState({ page: 1, pages: 1, total: 0 });

    // Projects
    const [projects, setProjects] = useState([]);
    const [projectsPagination, setProjectsPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [projectSearch, setProjectSearch] = useState('');

    // Delete confirmation
    const [deleteModal, setDeleteModal] = useState({ show: false, type: '', id: '', name: '' });
    const [deleting, setDeleting] = useState(false);

    // Redirect non-admin
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (!isAdmin) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, isAdmin, navigate]);

    // Fetch stats on mount
    useEffect(() => {
        if (!isAdmin) return;
        const fetchStats = async () => {
            try {
                const res = await adminAPI.getStats();
                setStats(res.data);
            } catch (err) {
                toast.error('Failed to load admin stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [isAdmin]);

    // Fetch users
    const fetchUsers = async (page = 1, search = '') => {
        try {
            const res = await adminAPI.getUsers({ page, limit: 10, search });
            setUsers(res.data.users);
            setUsersPagination(res.data.pagination);
        } catch (err) {
            toast.error('Failed to load users');
        }
    };

    // Fetch orders
    const fetchOrders = async (page = 1) => {
        try {
            const res = await adminAPI.getOrders({ page, limit: 10 });
            setOrders(res.data.orders);
            setOrdersPagination(res.data.pagination);
        } catch (err) {
            toast.error('Failed to load orders');
        }
    };

    // Fetch projects
    const fetchProjects = async (page = 1, search = '') => {
        try {
            const res = await adminAPI.getProjects({ page, limit: 10, search });
            setProjects(res.data.projects);
            setProjectsPagination(res.data.pagination);
        } catch (err) {
            toast.error('Failed to load projects');
        }
    };

    // Load data when tab changes
    useEffect(() => {
        if (!isAdmin) return;
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'orders') fetchOrders();
        if (activeTab === 'projects') fetchProjects();
    }, [activeTab, isAdmin]);

    // Handle search
    const handleUserSearch = (e) => {
        e.preventDefault();
        fetchUsers(1, userSearch);
    };

    const handleProjectSearch = (e) => {
        e.preventDefault();
        fetchProjects(1, projectSearch);
    };

    // Delete handlers
    const handleDelete = async () => {
        setDeleting(true);
        try {
            if (deleteModal.type === 'user') {
                await adminAPI.deleteUser(deleteModal.id);
                toast.success('User deleted successfully');
                fetchUsers(usersPagination.page, userSearch);
                // Refresh stats
                const res = await adminAPI.getStats();
                setStats(res.data);
            } else if (deleteModal.type === 'project') {
                await adminAPI.deleteProject(deleteModal.id);
                toast.success('Project deleted successfully');
                fetchProjects(projectsPagination.page, projectSearch);
                const res = await adminAPI.getStats();
                setStats(res.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        } finally {
            setDeleting(false);
            setDeleteModal({ show: false, type: '', id: '', name: '' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading text="Loading admin dashboard..." />
            </div>
        );
    }

    if (!isAdmin) return null;

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.users?.total || 0,
            subtitle: `${stats?.users?.buyers || 0} buyers · ${stats?.users?.sellers || 0} sellers · ${stats?.users?.both || 0} both`,
            icon: HiUsers,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Total Orders',
            value: stats?.orders?.total || 0,
            subtitle: `${stats?.orders?.completed || 0} completed`,
            icon: HiShoppingCart,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Total Revenue',
            value: `₹${(stats?.revenue?.totalRevenue || 0).toLocaleString()}`,
            subtitle: `Commission: ₹${(stats?.revenue?.totalCommission || 0).toLocaleString()}`,
            icon: HiCurrencyDollar,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            title: 'Total Projects',
            value: stats?.projects?.total || 0,
            subtitle: 'Listed on platform',
            icon: HiCollection,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];

    const monthlyCards = [
        {
            title: 'Monthly Orders',
            value: stats?.monthly?.orders || 0,
            icon: HiTrendingUp,
            color: 'text-cyan-600',
            bgColor: 'bg-cyan-50',
        },
        {
            title: 'Monthly Revenue',
            value: `₹${(stats?.monthly?.revenue || 0).toLocaleString()}`,
            icon: HiCash,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
        },
        {
            title: 'Monthly Commission',
            value: `₹${(stats?.monthly?.commission || 0).toLocaleString()}`,
            icon: HiCurrencyDollar,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    const tabs = [
        { id: 'overview', label: 'Overview', icon: HiTrendingUp },
        { id: 'users', label: 'Users', icon: HiUsers },
        { id: 'orders', label: 'Orders', icon: HiShoppingCart },
        { id: 'projects', label: 'Projects', icon: HiCollection },
    ];

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    </div>
                    <p className="text-gray-500 ml-13">Manage your platform — users, orders, and projects</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/25'
                                : 'glass text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ========== OVERVIEW TAB ========== */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Main Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {statCards.map((stat, i) => (
                                <div key={i} className="glass-card p-6 hover:scale-[1.02] transition-transform">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                    </div>
                                    <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
                                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                                </div>
                            ))}
                        </div>

                        {/* Monthly Stats */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Last 30 Days</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {monthlyCards.map((stat, i) => (
                                    <div key={i} className="glass-card p-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm">{stat.title}</p>
                                                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* User Role Breakdown */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 User Role Breakdown</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { label: 'Buyers', value: stats?.users?.buyers || 0, color: 'bg-blue-500' },
                                    { label: 'Sellers', value: stats?.users?.sellers || 0, color: 'bg-green-500' },
                                    { label: 'Both', value: stats?.users?.both || 0, color: 'bg-purple-500' },
                                ].map((role, i) => {
                                    const total = stats?.users?.total || 1;
                                    const pct = Math.round((role.value / total) * 100);
                                    return (
                                        <div key={i} className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-600 font-medium">{role.label}</span>
                                                <span className="text-gray-900 font-bold">{role.value}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`${role.color} h-2 rounded-full transition-all`}
                                                    style={{ width: `${pct}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-gray-500 text-xs mt-1">{pct}% of users</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== USERS TAB ========== */}
                {activeTab === 'users' && (
                    <div className="glass-card p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h3 className="text-xl font-bold text-gray-900">All Users</h3>
                            <form onSubmit={handleUserSearch} className="flex gap-2">
                                <div className="relative">
                                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        className="input-field pl-9 py-2 text-sm w-64"
                                    />
                                </div>
                                <button type="submit" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm transition-colors">
                                    Search
                                </button>
                            </form>
                        </div>

                        {users.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Name</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Email</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Role</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">College</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Sales</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Joined</th>
                                                <th className="text-right py-3 px-4 text-gray-500 font-medium text-sm">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((u) => (
                                                <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                                                <span className="text-white text-sm font-semibold">{u.name?.charAt(0).toUpperCase()}</span>
                                                            </div>
                                                            <span className="text-gray-900 font-medium">{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-500 text-sm">{u.email}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'seller' ? 'bg-green-50 text-green-600' :
                                                            u.role === 'buyer' ? 'bg-blue-50 text-blue-600' :
                                                                'bg-purple-50 text-purple-600'
                                                            }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-500 text-sm">{u.college || '—'}</td>
                                                    <td className="py-3 px-4 text-gray-500 text-sm">{u.totalSales || 0}</td>
                                                    <td className="py-3 px-4 text-gray-500 text-sm">
                                                        {new Date(u.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <button
                                                            onClick={() => setDeleteModal({ show: true, type: 'user', id: u._id, name: u.name })}
                                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                                            title="Delete user"
                                                        >
                                                            <HiTrash className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    pagination={usersPagination}
                                    onPageChange={(p) => fetchUsers(p, userSearch)}
                                />
                            </>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No users found</p>
                        )}
                    </div>
                )}

                {/* ========== ORDERS TAB ========== */}
                {activeTab === 'orders' && (
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">All Orders</h3>
                        {orders.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Project</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Buyer</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Seller</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Amount</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Commission</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Status</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 px-4 text-gray-900 font-medium text-sm">
                                                        {order.project?.title || 'Deleted project'}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-500 text-sm">{order.buyer?.name || '—'}</td>
                                                    <td className="py-3 px-4 text-gray-500 text-sm">{order.seller?.name || '—'}</td>
                                                    <td className="py-3 px-4 text-gray-900 text-sm">₹{order.amount}</td>
                                                    <td className="py-3 px-4 text-orange-500 text-sm">₹{order.commission}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'completed' ? 'bg-green-50 text-green-600' :
                                                            order.paymentStatus === 'failed' ? 'bg-red-50 text-red-600' :
                                                                order.paymentStatus === 'refunded' ? 'bg-yellow-50 text-yellow-600' :
                                                                    'bg-gray-100 text-gray-500'
                                                            }`}>
                                                            {order.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-500 text-sm">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    pagination={ordersPagination}
                                    onPageChange={(p) => fetchOrders(p)}
                                />
                            </>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No orders found</p>
                        )}
                    </div>
                )}

                {/* ========== PROJECTS TAB ========== */}
                {activeTab === 'projects' && (
                    <div className="glass-card p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h3 className="text-xl font-bold text-gray-900">All Projects</h3>
                            <form onSubmit={handleProjectSearch} className="flex gap-2">
                                <div className="relative">
                                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search projects..."
                                        value={projectSearch}
                                        onChange={(e) => setProjectSearch(e.target.value)}
                                        className="input-field pl-9 py-2 text-sm w-64"
                                    />
                                </div>
                                <button type="submit" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm transition-colors">
                                    Search
                                </button>
                            </form>
                        </div>

                        {projects.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Project</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Seller</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Category</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Price</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Views</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Downloads</th>
                                                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">Status</th>
                                                <th className="text-right py-3 px-4 text-gray-500 font-medium text-sm">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projects.map((project) => (
                                                <tr key={project._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={project.thumbnail || 'https://via.placeholder.com/40'}
                                                                alt={project.title}
                                                                className="w-10 h-10 rounded-lg object-cover"
                                                            />
                                                            <span className="text-gray-900 font-medium text-sm">{project.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-500 text-sm">{project.seller?.name || '—'}</td>
                                                    <td className="py-3 px-4">
                                                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                                            {project.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-900 text-sm">₹{project.price}</td>
                                                    <td className="py-3 px-4 text-gray-500 text-sm">{project.views || 0}</td>
                                                    <td className="py-3 px-4 text-gray-500 text-sm">{project.downloads || 0}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                            }`}>
                                                            {project.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <button
                                                            onClick={() => setDeleteModal({ show: true, type: 'project', id: project._id, name: project.title })}
                                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                                            title="Delete project"
                                                        >
                                                            <HiTrash className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    pagination={projectsPagination}
                                    onPageChange={(p) => fetchProjects(p, projectSearch)}
                                />
                            </>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No projects found</p>
                        )}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteModal.show && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                        <div className="glass-card p-6 max-w-md w-full animate-in">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                                    <HiExclamation className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Delete {deleteModal.type === 'user' ? 'User' : 'Project'}?
                                </h3>
                                <p className="text-gray-500">
                                    Are you sure you want to delete <span className="text-gray-900 font-medium">"{deleteModal.name}"</span>?
                                    {deleteModal.type === 'user' && ' This will also delete all their projects.'}
                                    {' '}This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ show: false, type: '', id: '', name: '' })}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-50"
                                >
                                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Reusable pagination component
const Pagination = ({ pagination, onPageChange }) => {
    if (pagination.pages <= 1) return null;
    return (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
                Page {pagination.page} of {pagination.pages} · {pagination.total} total
            </p>
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="p-2 rounded-lg glass text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <HiChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="p-2 rounded-lg glass text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <HiChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
