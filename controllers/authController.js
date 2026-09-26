const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../services/emailService.js');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationCode =
            Math.floor(100000 + Math.random() * 900000).toString();

        const hashedVerificationCode =
            await bcrypt.hash(verificationCode, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationCode: hashedVerificationCode,
            verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000)
        });

        await user.save();

        await sendVerificationEmail(email, verificationCode);

        res.status(201).json({
            message: 'User registered successfully. Verification code sent.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Please verify your email before logging in'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error'
        });
    }
}


module.exports = {
    registerUser,
    login
};

const verifyEmail = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: 'Email is already verified'
            });
        }

        if (
            !userverificationCodeExpires ||
            user.verificationCodeExpires < new Date()
        ) {
            return res.status(400).json({
                message: 'Verification code has expired'
            });
        }

        const isMatch = await bcrypt.compare(verificationCode, user.verificationCode);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid verification code'
            });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;

        await user.save();

        res.status(200).json({
            message: 'Email verified successfully'
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

module.exports = {
    registerUser,
    login,
    verifyEmail
};