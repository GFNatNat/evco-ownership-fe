const express = require('express');
const router = express.Router();

// POST /api/shared/license/verify
router.post('/verify', (req, res) => {
    // TODO: Verifies a driving license
    res.json({ message: 'Verifies a driving license' });
});

// GET /api/shared/license/check-exists
router.get('/check-exists', (req, res) => {
    // TODO: Checks if a license number is already registered
    res.json({ message: 'Checks if a license number is already registered' });
});

// GET /api/shared/license/info
router.get('/info', (req, res) => {
    // TODO: Gets license information by license number
    res.json({ message: 'Gets license information by license number' });
});

// PATCH /api/shared/license/status
router.patch('/status', (req, res) => {
    // TODO: Updates license status (admin only)
    res.json({ message: 'Updates license status (admin only)' });
});

// GET /api/shared/license/user/:userId
router.get('/user/:userId', (req, res) => {
    // TODO: Gets license information for a specific user
    res.json({ message: 'Gets license information for a specific user', userId: req.params.userId });
});

// PUT /api/shared/license/:licenseId
router.put('/:licenseId', (req, res) => {
    // TODO: Updates license information
    res.json({ message: 'Updates license information', licenseId: req.params.licenseId });
});

// DELETE /api/shared/license/:licenseId
router.delete('/:licenseId', (req, res) => {
    // TODO: Deletes a license
    res.json({ message: 'Deletes a license', licenseId: req.params.licenseId });
});

// POST /api/shared/license/register
router.post('/register', (req, res) => {
    // TODO: Registers a verified license to the system
    res.json({ message: 'Registers a verified license to the system' });
});

// GET /api/shared/license/my-license
router.get('/my-license', (req, res) => {
    // TODO: Gets the authenticated user's license information
    res.json({ message: "Gets the authenticated user's license information" });
});

module.exports = router;
