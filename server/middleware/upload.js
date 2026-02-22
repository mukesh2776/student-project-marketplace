const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Check if Cloudinary is configured
const hasCloudinary = !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

let imageStorage;

if (hasCloudinary) {
    // Use Cloudinary for image uploads (production)
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const cloudinary = require('cloudinary').v2;

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    imageStorage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'student-marketplace/images',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }]
        }
    });

    console.log('✅ Cloudinary configured for image uploads');
} else {
    // Fallback to local disk storage (development / missing config)
    console.log('⚠️  Cloudinary not configured — using local disk for image uploads');
    const imageDir = path.join(__dirname, '../uploads/images');
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
    }

    imageStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, imageDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });
}

// For project ZIP files — always use local disk
const projectDir = path.join(__dirname, '../uploads/projects');
if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
}

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
    uploadProject,
    hasCloudinary
};
