const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a project title'],
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: [true, 'Please provide a project description'],
        maxlength: 2000
    },
    shortDescription: {
        type: String,
        maxlength: 200
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: 0
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['web-development', 'mobile-app', 'machine-learning', 'data-science', 'blockchain', 'iot', 'game-development', 'desktop-app', 'api', 'other']
    },
    techStack: [{
        type: String,
        required: true
    }],
    images: [{
        type: String
    }],
    thumbnail: {
        type: String,
        default: ''
    },
    demoUrl: {
        type: String,
        default: ''
    },
    githubUrl: {
        type: String,
        default: ''
    },
    videoUrl: {
        type: String,
        default: ''
    },
    downloadFile: {
        type: String,
        default: ''
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    features: [{
        type: String
    }],
    requirements: [{
        type: String
    }],
    downloads: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Add text index for search
projectSchema.index({ title: 'text', description: 'text', techStack: 'text' });

module.exports = mongoose.model('Project', projectSchema);
