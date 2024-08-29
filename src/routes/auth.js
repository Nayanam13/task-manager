const express = require('express');
const router = express.Router();

const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const googleClientID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(googleClientID);


router.post('/google', async (req, res) => {
    
    const { token } = req.body;
    
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: googleClientID,
        });
        console.log("ticket",ticket)

        const { sub,email } = ticket.getPayload();
        console.log(sub)

        let user = await User.findOne({ googleId: sub });

        if (!user) {
            user = new User({ 
                googleId: sub,
                email
             });
            await user.save();
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ 
            success: true,
            token: jwtToken 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Google sign-in failed' });
    }
});

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        user = new User({
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({ token });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Generate a JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

module.exports = router;