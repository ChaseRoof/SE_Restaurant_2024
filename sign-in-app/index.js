// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Up = require('./models/User');
const bcrypt =require('bcrypt');
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/signInApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Route to render sign-in form

app.get('/sign-in', (req, res) => {
    res.render('sign-in');
});
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/sign-up', (req, res) => {
    res.render('sign-up');
});


// Route to handle form submission
app.post('/sign-up', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await Up.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists with that email.");
        }

        // Create and save new user
        const user = new Up({ firstName, lastName, email, password });
        await user.save();
        res.send("User registered successfully!");
    } catch (error) {
        res.status(400).send("Error registering user: " + error.message);
    }
});

app.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await Up.findOne({ email });
        if (!user) {
            return res.status(400).send("No user found with that email.");
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid password.");
        }

        res.send("Successfully signed in!");
    } catch (error) {
        res.status(400).send("Error signing in: " + error.message);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
