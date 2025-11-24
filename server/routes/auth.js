const express = require('express')
const router = express.Router()
const User = require('../models/User')

// Signup (mock - creates user if not exists)
router.post('/register', async (req, res) => {
    const { name, email } = req.body
    let u = await User.findOne({ email })
    if (!u) u = await User.create({ name, email, roles: ['coowner'] })
    res.json({ user: u })
})

// Login (mock)
router.post('/login', async (req, res) => {
    const { email } = req.body
    const u = await User.findOne({ email })
    if (!u) return res.status(401).json({ message: 'User not found' })
    // in prod, return token; here we return user object only
    res.json({ user: u })
})

module.exports = router