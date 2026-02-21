const Order = require('../models/Order');
const Project = require('../models/Project');
const User = require('../models/User');
const crypto = require('crypto');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { projectId, paymentId, paymentMethod } = req.body;

        // Get project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Can't buy own project
        if (project.seller.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot buy your own project' });
        }

        // Check if already purchased
        const existingOrder = await Order.findOne({
            buyer: req.user._id,
            project: projectId,
            paymentStatus: 'completed'
        });

        if (existingOrder) {
            return res.status(400).json({ message: 'You have already purchased this project' });
        }

        // Generate download token
        const downloadToken = crypto.randomBytes(32).toString('hex');

        // Create order
        const order = await Order.create({
            buyer: req.user._id,
            project: projectId,
            seller: project.seller,
            amount: project.price,
            paymentId,
            paymentMethod,
            paymentStatus: 'completed',
            downloadToken,
            downloadExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

        // Update project downloads
        project.downloads += 1;
        await project.save();

        // Update seller earnings
        await User.findByIdAndUpdate(project.seller, {
            $inc: {
                totalSales: 1,
                totalEarnings: order.sellerEarning
            }
        });

        const populatedOrder = await Order.findById(order._id)
            .populate('project', 'title thumbnail')
            .populate('seller', 'name');

        res.status(201).json(populatedOrder);
    } catch (error) {
        next(error);
    }
};

// @desc    Get my purchases
// @route   GET /api/orders/my-purchases
// @access  Private
exports.getMyPurchases = async (req, res, next) => {
    try {
        const orders = await Order.find({
            buyer: req.user._id,
            paymentStatus: 'completed'
        })
            .populate('project', 'title thumbnail category techStack')
            .populate('seller', 'name avatar')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Get my sales
// @route   GET /api/orders/my-sales
// @access  Private
exports.getMySales = async (req, res, next) => {
    try {
        const orders = await Order.find({
            seller: req.user._id,
            paymentStatus: 'completed'
        })
            .populate('project', 'title thumbnail')
            .populate('buyer', 'name avatar')
            .sort({ createdAt: -1 });

        // Calculate stats
        const totalEarnings = orders.reduce((sum, order) => sum + order.sellerEarning, 0);
        const totalCommission = orders.reduce((sum, order) => sum + order.commission, 0);

        res.json({
            orders,
            stats: {
                totalSales: orders.length,
                totalEarnings,
                totalCommission
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('project')
            .populate('seller', 'name email')
            .populate('buyer', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is buyer or seller
        if (
            order.buyer._id.toString() !== req.user._id.toString() &&
            order.seller._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        next(error);
    }
};

// @desc    Download project
// @route   GET /api/orders/:id/download
// @access  Private
exports.downloadProject = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('project');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is the buyer
        if (order.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check download limits
        if (order.downloadCount >= order.maxDownloads) {
            return res.status(400).json({ message: 'Download limit exceeded' });
        }

        // Check expiry
        if (new Date() > order.downloadExpiry) {
            return res.status(400).json({ message: 'Download link has expired' });
        }

        // Increment download count
        order.downloadCount += 1;
        await order.save();

        // Return download URL (in production, this would be a signed URL or actual file)
        res.json({
            downloadUrl: order.project.downloadFile || order.project.githubUrl,
            downloadsRemaining: order.maxDownloads - order.downloadCount
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard stats
// @route   GET /api/orders/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
    try {
        // Purchases stats
        const purchases = await Order.find({
            buyer: req.user._id,
            paymentStatus: 'completed'
        });

        // Sales stats
        const sales = await Order.find({
            seller: req.user._id,
            paymentStatus: 'completed'
        });

        const totalSpent = purchases.reduce((sum, order) => sum + order.amount, 0);
        const totalEarnings = sales.reduce((sum, order) => sum + order.sellerEarning, 0);

        // Get recent activity
        const recentPurchases = await Order.find({ buyer: req.user._id })
            .populate('project', 'title thumbnail')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentSales = await Order.find({ seller: req.user._id })
            .populate('project', 'title thumbnail')
            .populate('buyer', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            purchases: {
                total: purchases.length,
                totalSpent
            },
            sales: {
                total: sales.length,
                totalEarnings
            },
            recentPurchases,
            recentSales
        });
    } catch (error) {
        next(error);
    }
};
