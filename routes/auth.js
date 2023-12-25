const router = require('express').Router();
const User = require('../models/auth.model');
const bcrypt = require('bcrypt');
const secret = "OxaW3nOAMAUASNnkasd";
const jwt = require("jsonwebtoken")
const crypto = require('crypto');
const Token = require('../models/token.model')
const nodemailer = require('nodemailer');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'missing required fields!' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'email is already registered!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        const token = new Token({
            userId: user._id,
            emailToken: crypto.randomBytes(64).toString('hex'),
        });

        await token.save();

        // Send email with confirmation link
        const confirmationLink = `http://localhost:8000/api/user/verify-email?token=${token.emailToken}`;

        const transporter = nodemailer.createTransport({
            // Configure your email sending service (SMTP)
            service: 'gmail',
            auth: {
                user: 'ejayawan22@gmail.com',
                pass: 'kawm lvhp uudi gmpc',
            },
        });

        const mailOptions = {
            from: email,
            to: user.email,
            subject: 'Confirmation Email',
            text: `Click the following link to confirm your registration: ${confirmationLink}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ error: 'Error sending confirmation email.' });
            } else {
                console.log('Email sent:', info.response);
                res.status(200).json({
                    user: user.toJSON(),
                    token: token.toJSON(),
                });
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});



router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            res.status(400).json({ message: "missing required fields" });
        }

        const user = await User.findOne({ email });
        if(!user){
            res.status(404).json({ message: "User not found!" });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){
            const token = jwt.sign({ userId: user._id }, secret, {expiresIn: '7d'});

            res.status(200).json({ userId: user._id, token });
        } else {
            res.status(401).json({ message: 'Invalid password!' });
        }
    }
    catch(error){
        res.status(500).json(error);
    }
})


router.post('/logout', async (req, res) => {
    try{
        res.status(200).json({ message: 'logout successfully!' })
    }
    catch(error){
        res.status(400).json(error)
    }
})

router.get('/verify-email', async (req, res) => {
    try {
        const tokenValue = req.query.token;

        // Find the user based on the token
        const token = await Token.findOne({ emailToken: tokenValue });

        if (!token) {
            return res.status(404).json({ error: 'Invalid token or token expired.' });
        }

        // Update user verification status
        const user = await User.findById(token.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'User is already verified.' });
        }

        user.isVerified = true;
        await user.save();

        // Optionally, you can remove the used token from the database
        await Token.findByIdAndDelete(token._id);

        // Respond to the client with a success message or redirect
        res.status(200).json({ message: 'Email verified successfully!', user: user.toJSON() });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
