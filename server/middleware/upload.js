const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const imageDir = path.join(__dirname, '../uploads/images');
const projectDir = path.join(__dirname, '../uploads/projects');

[imageDir, projectDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Image upload configuration
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Project zip upload configuration
const projectStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, projectDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'), false);
    }
};

// File filter for zip files
const projectFilter = (req, file, cb) => {
    const allowedTypes = /zip/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const allowedMimes = ['application/zip', 'application/x-zip-compressed', 'application/x-zip'];

    if (extname && allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only ZIP files are allowed!'), false);
    }
};

// Upload middlewares
const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFilter
});

const uploadProject = multer({
    storage: projectStorage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    fileFilter: projectFilter
});

module.exports = {
    uploadImage,
    uploadProject
};
