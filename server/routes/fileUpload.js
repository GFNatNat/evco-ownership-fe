const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

// POST /api/FileUpload/upload
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // Lưu thông tin file vào DB nếu cần
    res.status(200).json({ message: 'UPLOAD_SUCCESS', fileId: req.file.filename });
});

// GET /api/FileUpload/:id/download
router.get('/:id/download', (req, res) => {
    const filePath = path.join('uploads', req.params.id);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
    res.download(filePath);
});

// GET /api/FileUpload/:id
router.get('/:id', (req, res) => {
    const filePath = path.join('uploads', req.params.id);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
    res.sendFile(path.resolve(filePath));
});

// DELETE /api/FileUpload/:id
router.delete('/:id', (req, res) => {
    // TODO: Check admin quyền
    const filePath = path.join('uploads', req.params.id);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
    fs.unlinkSync(filePath);
    res.status(200).json({ message: 'DELETE_SUCCESS' });
});

// GET /api/FileUpload/:id/info
router.get('/:id/info', (req, res) => {
    const filePath = path.join('uploads', req.params.id);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
    const stats = fs.statSync(filePath);
    res.status(200).json({
        size: stats.size,
        createdAt: stats.birthtime,
        updatedAt: stats.mtime,
        fileId: req.params.id
    });
});

module.exports = router;
