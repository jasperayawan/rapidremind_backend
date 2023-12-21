const router = require('express').Router();
const User = require('../models/auth.model');
const bcrypt = require('bcrypt');
const secret = "OxaW3nOAMAUASNnkasd";
const jwt = require("jsonwebtoken")

router.post('/register', async (req, res) => {
    try{
        const {username, email, password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({ message: 'missing required fields!' })
        }

        const existingEmail = await User.findOne({ email });
        if(existingEmail){
            res.status(400).json({ message: 'email is already registered!' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username, email, password: hashedPassword
        })

        res.status(200).json(user.toJSON());
    }
    catch(error){
        res.status(500).json(error);
    }
})


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


module.exports = router;
