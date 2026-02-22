const express = require('express');
const router = express.Router();
const { uploadImage, uploadProject, hasCloudinary } = require('../middleware/upload');
const { protect, isSeller } = require('../middleware/auth');

// @desc    Upload thumbnail image (to Cloudinary if configured, else local disk)
// @route   POST /api/upload/image
// @access  Private (Seller)
router.post('/image', protect, isSeller, (req, res, next) => {
    uploadImage.single('image')(req, res, (err) => {
        if (err) {
            console.error('❌ Image upload error:', err.message);
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File too large. Max 5MB allowed.' });
            }
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Cloudinary returns URL in req.file.path
        // Local disk returns filename in req.file.filename
        let url;
        if (hasCloudinary) {
            url = req.file.path;
        } else {
            url = `/uploads/images/${req.file.filename}`;
        }

        console.log(`✅ Image uploaded: ${url} (${hasCloudinary ? 'Cloudinary' : 'local'})`);

        res.json({
            message: 'Image uploaded successfully',
            url,
            filename: req.file.filename
        });
    });
});

// @desc    Upload project zip file
// @route   POST /api/upload/project
// @access  Private (Seller)
router.post('/project', protect, isSeller, (req, res, next) => {
    uploadProject.single('project')(req, res, (err) => {
        if (err) {
            console.error('❌ Project upload error:', err.message);
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File too large. Max 100MB allowed.' });
            }
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `/uploads/projects/${req.file.filename}`;
        console.log(`✅ Project file uploaded: ${fileUrl}`);

        res.json({
            message: 'Project file uploaded successfully',
            url: fileUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        });
    });
});

module.exports = router;
