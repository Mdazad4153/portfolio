const multer = require('multer');
const path = require('path');

/**
 * Configure storage - USE MEMORY STORAGE for Vercel/Serverless
 * Files are handled in RAM (buffer) and then sent directly to Supabase Storage.
 * This avoids any local filesystem dependencies which would fail on Vercel.
 */
const storage = multer.memoryStorage();

/**
 * File filter to restrict uploads to specific image types and PDFs
 */
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png, gif, webp) and PDF files are allowed!'));
};

/**
 * Multer middleware instance
 * Limit file size to 10MB
 */
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter
});

module.exports = upload;
