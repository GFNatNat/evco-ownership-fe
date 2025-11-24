
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/Auth/register
router.post('/register', async (req, res) => {
    const {
        email, password, confirmPassword,
        firstName, lastName, phone, dateOfBirth, address
    } = req.body;

    // Validate
    if (!email) return res.status(400).json({ message: 'EMAIL_REQUIRED' });
    if (!/\S+@\S+\.\S+/.test(email)) return res.status(400).json({ message: 'INVALID_EMAIL_FORMAT' });
    if (!password) return res.status(400).json({ message: 'PASSWORD_REQUIRED' });
    if (password.length < 8) return res.status(400).json({ message: 'PASSWORD_MIN_8_CHARACTERS' });
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password))
        return res.status(400).json({ message: 'PASSWORD_MUST_CONTAIN_UPPERCASE_LOWERCASE_NUMBER_SPECIAL' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'CONFIRM_PASSWORD_MUST_MATCH' });
    if (!firstName) return res.status(400).json({ message: 'FIRST_NAME_REQUIRED' });
    if (!lastName) return res.status(400).json({ message: 'LAST_NAME_REQUIRED' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'EMAIL_ALREADY_EXISTS' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email, password: hashedPassword, firstName, lastName, phone, dateOfBirth, address, status: 'active'
    });
    await newUser.save();
    res.status(201).json({ message: 'REGISTRATION_SUCCESS' });
});

// POST /api/Auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'INVALID_EMAIL_OR_PASSWORD' });

    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({ message: 'INVALID_EMAIL_OR_PASSWORD' });

    if (user.status === 'suspended')
        return res.status(403).json({ message: 'ACCOUNT_SUSPENDED' });
    if (user.status === 'inactive')
        return res.status(403).json({ message: 'ACCOUNT_INACTIVE' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.status(400).json({ message: 'INVALID_EMAIL_OR_PASSWORD' });

    // Tạo JWT token
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1d' });
    res.status(200).json({ message: 'LOGIN_SUCCESS', token });
});

// POST /api/Auth/refresh-token
router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Validation error' });

    try {
        // Giả sử lưu refreshToken trong User
        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(404).json({ message: 'USER_NOT_FOUND' });
        if (user.status === 'suspended') return res.status(403).json({ message: 'ACCOUNT_SUSPENDED' });
        if (user.status === 'inactive') return res.status(403).json({ message: 'ACCOUNT_INACTIVE' });

        // Kiểm tra hạn refreshToken (giả sử lưu expiresRefreshToken)
        if (user.expiresRefreshToken && user.expiresRefreshToken < Date.now()) {
            return res.status(401).json({ message: 'INVALID_OR_EXPIRED_REFRESH_TOKEN' });
        }

        // Tạo access token mới
        const newToken = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1d' });
        res.status(200).json({ message: 'TOKEN_REFRESH_SUCCESS', token: newToken });
    } catch (err) {
        res.status(401).json({ message: 'INVALID_OR_EXPIRED_REFRESH_TOKEN' });
    }
});

// POST /api/Auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Validation error' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'USER_NOT_FOUND' });

    // Tạo OTP (giả sử 6 số)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 phút
    await user.save();

    // Gửi email (giả sử dùng console.log)
    console.log(`Send OTP ${otp} to email ${email}`);

    res.status(200).json({ message: 'SUCCESS' });
});

// POST /api/Auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Validation error' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'USER_NOT_FOUND' });
    if (!user.resetOtp || !user.resetOtpExpires || user.resetOtpExpires < Date.now()) {
        return res.status(400).json({ message: 'OTP_EXPIRED_OR_INVALID' });
    }
    if (user.resetOtp !== otp) {
        return res.status(400).json({ message: 'OTP_INCORRECT' });
    }
    // Đánh dấu xác thực OTP thành công
    user.otpVerified = true;
    await user.save();
    res.status(200).json({ message: 'OTP_VERIFIED_SUCCESS' });
});

// POST /api/Auth/reset-password
router.post('/reset-password', async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) return res.status(400).json({ message: 'Validation error' });
    if (newPassword !== confirmPassword) return res.status(400).json({ message: 'CONFIRM_PASSWORD_MUST_MATCH' });
    if (newPassword.length < 8) return res.status(400).json({ message: 'PASSWORD_MIN_8_CHARACTERS' });
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword))
        return res.status(400).json({ message: 'PASSWORD_MUST_CONTAIN_UPPERCASE_LOWERCASE_NUMBER_SPECIAL' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'USER_NOT_FOUND' });
    if (!user.otpVerified) return res.status(400).json({ message: 'OTP_NOT_VERIFIED' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otpVerified = false;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();
    res.status(200).json({ message: 'PASSWORD_RESET_SUCCESS' });
});

module.exports = router;