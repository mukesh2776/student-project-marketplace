const express = require('express');
const router = express.Router();
const { uploadImage, uploadProject } = require('../middleware/upload');
const { protect, isSeller } = require('../middleware/auth');

// @desc    Upload thumbnail image
// @route   POST /api/upload/image
// @access  Private (Seller)
router.post('/image', protect, isSeller, uploadImage.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Return the URL to access the uploaded file
        const fileUrl = `/uploads/images/${req.file.filename}`;
        res.json({
            message: 'Image uploaded successfully',
            url: fileUrl,
            filename: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image', error: error.message });
    }
});

// @desc    Upload project zip file
// @route   POST /api/upload/project
// @access  Private (Seller)
router.post('/project', protect, isSeller, uploadProject.single('project'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Return the URL to access the uploaded file
        const fileUrl = `/uploads/projects/${req.file.filename}`;
        res.json({
            message: 'Project file uploaded successfully',
            url: fileUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading project file', error: error.message });
    }
});

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large' });
    }
    if (error.message) {
        return res.status(400).json({ message: error.message });
    }
    next(error);
});

module.exports = router;
