const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
    try {
        const {
            category,
            search,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 12
        } = req.query;

        // Build query
        let query = { isActive: true };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$text = { $search: search };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Sort options
        let sortOption = { createdAt: -1 };
        if (sort === 'price-low') sortOption = { price: 1 };
        if (sort === 'price-high') sortOption = { price: -1 };
        if (sort === 'rating') sortOption = { rating: -1 };
        if (sort === 'popular') sortOption = { downloads: -1 };

        const skip = (Number(page) - 1) * Number(limit);

        const projects = await Project.find(query)
            .populate('seller', 'name avatar rating')
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const total = await Project.countDocuments(query);

        res.json({
            projects,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            total
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
exports.getFeaturedProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({ isActive: true, isFeatured: true })
            .populate('seller', 'name avatar rating')
            .sort({ createdAt: -1 })
            .limit(8);

        res.json(projects);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('seller', 'name avatar rating bio college totalSales');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Increment views
        project.views += 1;
        await project.save();

        res.json(project);
    } catch (error) {
        next(error);
    }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Seller)
exports.createProject = async (req, res, next) => {
    try {
        const {
            title,
            description,
            shortDescription,
            price,
            category,
            techStack,
            demoUrl,
            videoUrl,
            features,
            requirements,
            images,
            thumbnail,
            downloadFile
        } = req.body;

        const project = await Project.create({
            title,
            description,
            shortDescription,
            price,
            category,
            techStack,
            demoUrl,
            videoUrl,
            features,
            requirements,
            images,
            thumbnail,
            downloadFile,
            seller: req.user._id
        });

        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Owner)
exports.updateProject = async (req, res, next) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check ownership
        if (project.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(project);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Owner)
exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check ownership
        if (project.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this project' });
        }

        await project.deleteOne();

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my listings
// @route   GET /api/projects/my-listings
// @access  Private
exports.getMyListings = async (req, res, next) => {
    try {
        const projects = await Project.find({ seller: req.user._id })
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (error) {
        next(error);
    }
};

// @desc    Get projects by category
// @route   GET /api/projects/category/:category
// @access  Public
exports.getProjectsByCategory = async (req, res, next) => {
    try {
        const projects = await Project.find({
            category: req.params.category,
            isActive: true
        })
            .populate('seller', 'name avatar rating')
            .sort({ createdAt: -1 })
            .limit(12);

        res.json(projects);
    } catch (error) {
        next(error);
    }
};

// @desc    Get similar projects
// @route   GET /api/projects/:id/similar
// @access  Public
exports.getSimilarProjects = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const similar = await Project.find({
            category: project.category,
            _id: { $ne: project._id },
            isActive: true
        })
            .populate('seller', 'name avatar rating')
            .limit(4);

        res.json(similar);
    } catch (error) {
        next(error);
    }
};
