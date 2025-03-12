const express = require('express');
const router = express.Router();
const AccessService = require('../services/access.service');

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { user, tokens } = await AccessService.login({ email, password });
        res.json({ status: 'success', data: { token: tokens.accessToken, user } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
