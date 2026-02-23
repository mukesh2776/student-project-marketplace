const express = require('express');
const router = express.Router();
const { uploadImage, uploadProject, hasCloudinary, cloudinary } = require('../middleware/upload');
const { protect, isSeller } = require('../middleware/auth');

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'student-marketplace/images',
                allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
                ...options
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        stream.end(buffer);
    });
};

// @desc    Upload thumbnail image
// @route   POST /api/upload/image
// @access  Private (Seller)
router.post('/image', protect, isSeller, (req, res) => {
    uploadImage.single('image')(req, res, async (multerErr) => {
        if (multerErr) {
            console.error('❌ Multer error:', multerErr.message);
            if (multerErr.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File too large. Max 5MB allowed.' });
            }
            return res.status(400).json({ message: multerErr.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        try {
            let url;

            if (hasCloudinary && cloudinary) {
                // Upload buffer to Cloudinary
                console.log('📤 Uploading to Cloudinary...');
                const result = await uploadToCloudinary(req.file.buffer);
                url = result.secure_url;
                console.log('✅ Cloudinary upload success:', url);
            } else {
                // Local disk — file already saved by multer
                url = `/uploads/images/${req.file.filename}`;
                console.log('✅ Local upload success:', url);
            }

            res.json({
                message: 'Image uploaded successfully',
                url,
                filename: req.file.filename || req.file.originalname
            });
        } catch (cloudErr) {
            console.error('❌ Cloudinary upload failed:', cloudErr.message);
            console.error('❌ Full error:', JSON.stringify(cloudErr, null, 2));
            res.status(500).json({
                message: 'Image upload to cloud failed: ' + cloudErr.message
            });
        }
    });
});

// @desc    Upload project zip file
// @route   POST /api/upload/project
// @access  Private (Seller)
router.post('/project', protect, isSeller, (req, res) => {
    uploadProject.single('project')(req, res, (multerErr) => {
        if (multerErr) {
            console.error('❌ Project upload error:', multerErr.message);
            if (multerErr.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File too large. Max 100MB allowed.' });
            }
            return res.status(400).json({ message: multerErr.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `/uploads/projects/${req.file.filename}`;
        console.log('✅ Project file uploaded:', fileUrl);

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
