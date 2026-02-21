const User = require('../models/User');
const Order = require('../models/Order');
const Project = require('../models/Project');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
exports.getAdminStats = async (req, res, next) => {
    try {
        // Total users (excluding admin)
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });

        // Total orders
        const totalOrders = await Order.countDocuments();
        const completedOrders = await Order.countDocuments({ paymentStatus: 'completed' });

        // Revenue stats
        const revenueStats = await Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' },
                    totalCommission: { $sum: '$commission' },
                    totalSellerEarnings: { $sum: '$sellerEarning' }
                }
            }
        ]);

        const revenue = revenueStats[0] || {
            totalRevenue: 0,
            totalCommission: 0,
            totalSellerEarnings: 0
        };

        // Total projects
        const totalProjects = await Project.countDocuments();

        // Recent orders (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentOrders = await Order.countDocuments({
            createdAt: { $gte: thirtyDaysAgo },
            paymentStatus: 'completed'
        });

        // Monthly revenue
        const monthlyRevenue = await Order.aggregate([
            { $match: { paymentStatus: 'completed', createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: '$amount' },
                    commission: { $sum: '$commission' }
                }
            }
        ]);

        const monthly = monthlyRevenue[0] || { revenue: 0, commission: 0 };

        // User role breakdown
        const buyerCount = await User.countDocuments({ role: 'buyer' });
        const sellerCount = await User.countDocuments({ role: 'seller' });
        const bothCount = await User.countDocuments({ role: 'both' });

        res.json({
            users: {
                total: totalUsers,
                buyers: buyerCount,
                sellers: sellerCount,
                both: bothCount
            },
            orders: {
                total: totalOrders,
                completed: completedOrders
            },
            revenue: {
                totalRevenue: revenue.totalRevenue,
                totalCommission: revenue.totalCommission,
                totalSellerEarnings: revenue.totalSellerEarnings
            },
            monthly: {
                orders: recentOrders,
                revenue: monthly.revenue,
                commission: monthly.commission
            },
            projects: {
                total: totalProjects
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        const query = { role: { $ne: 'admin' } };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('name email role avatar college totalSales totalEarnings createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        res.json({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders/sales
// @route   GET /api/admin/orders
// @access  Admin
exports.getAllOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .populate('buyer', 'name email')
            .populate('seller', 'name email')
            .populate('project', 'title price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments();

        res.json({
            orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin user' });
        }

        // Delete user's projects
        await Project.deleteMany({ seller: user._id });
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all projects (admin)
// @route   GET /api/admin/projects
// @access  Admin
exports.getAllProjects = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        const query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        const projects = await Project.find(query)
            .populate('seller', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Project.countDocuments(query);

        res.json({
            projects,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a project (admin)
// @route   DELETE /api/admin/projects/:id
// @access  Admin
exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await Project.findByIdAndDelete(req.params.id);

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        next(error);
    }
};
