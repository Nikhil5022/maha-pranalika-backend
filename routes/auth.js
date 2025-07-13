
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();


const router = express.Router();

const { sendVerificationEmail, sendForgotPasswordEmail } = require('./sendEmail');
const JWT_SECRET = "your_jwt_secret_key";


// const JWT_SECRET = process.env.JWTSECRET;
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        const link = `http://localhost:5000/api/email/verify?token=${token}`;
        const sendMail = await sendVerificationEmail(newUser.email, link);

        if (sendMail) {
            return res.status(201).json({
                message: 'User registered successfully! Error in sending verification mail',
                token
            });
        } else {
            return res.status(201).json({
                message: 'User registered successfully!',
                token
            });
        }

    } catch (err) {
        console.error('Signup error:', err.message);
        return res.status(500).json({ message: 'Server error' });
    }
});



router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token
        });

    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Please enter vaild email' });

    }
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
        return res.status(404).json({ success: false, message: 'User is not found!' });
    }

    const token = jwt.sign(
        { email: oldUser.email, },
        JWT_SECRET,
        { expiresIn: '2h' }
    );
    const link = "http://localhost:5173/resetpassword?token=" + token;
    const sendMail = await sendForgotPasswordEmail(oldUser.email, link);
    if (!sendMail) {
        res.status(201).json({
            success: true,
            message: 'Email sent!',
            token
        });
    }
    else {
        res.status(201).json({
            message: 'Error in sending mail',
            token
        });
    }
})
router.get('/verifytheToken', async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(404).json({ success: false, message: 'Invalid Token!' });
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, JWT_SECRET);
    }
    catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid Token!', error: err });
    }

    const oldUser = await User.findOne({ email: decodedToken.email });
    if (!oldUser) {
        return res.status(400).json({ success: false, message: "User not found!" })
    }
    res.status(200).json({ success: true, data: decodedToken.email });
});
router.post('/resetpassword', async (req, res) => {
    const { email, newPassword, confirmNewPassword } = req.body;
    if (!email || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Please enter  a valid email address' });
    }
    const oldUser = await User.findOne({ email })

    if (!oldUser) {
        return res.status(400).json({ success: false, message: 'Please enter vaild details' });
    }
    if (newPassword != confirmNewPassword) {
        return res.status(400).json({ success: false, message: 'Passwords donot match!' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedData = await User.findOneAndUpdate({ email }, {
        $set: {
            password: hashedPassword
        }
    });
    if (updatedData) {
        return res.status(200).send({ success: true, message: "Password Updated Successfully" });
    }
    else {
        return res.status(500).send({ success: true, message: "Something went wrong" });
    }

})
router.get('/verify', verifyToken, (req, res) => {
    res.status(200).json({
        message: 'Token is valid',
        user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }
    });
});

module.exports = router;
