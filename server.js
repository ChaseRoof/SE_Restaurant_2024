require('dotenv').config(); // Make sure you're loading environment variables

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs'); // Add bcrypt for password hashing
const User = require('./models/User'); // Import the User model
const Post = require('./models/Post');// import user model



const jwt = require('jsonwebtoken'); // Ensure you have the JWT library

const app = express();
const PORT = 3000; // You can change this to any port you prefer

// Middleware to parse JSON data
app.use(express.json());

//Connect to MongoDB
mongoose.connect('mongodb+srv://torsarahman31:j37fWv5a9xczUP@cluster0.2hqi1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Serve the main HTML file (signup.html or index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ success: false, message: 'Token is required' });
  }

  jwt.verify(token, '0831', (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.userId = decoded.userId; // Save the user ID from the token
    next();
  });
};

///////////////////////////////////////////////////////////////////////////////////






///////////////////////////////////////////////////////////////////////////////////////



app.post('/signup', async (req, res) => {
  const { fullName, email, username, password } = req.body;
  
  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email or username already exists' });
    }
    
    const newUser = new User({
      fullName,
      email,
      username,
      password
    });
    
    await newUser.save();
    res.json({ success: true, message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating user: ' + err.message });
  }
});

// login
app.post('/login', async (req, res) => {
  console.log('Login route hit');
  const { username, password } = req.body;

  try {
    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]  // Search by both username or email
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);  // bcrypt.compare hashes the input password and compares it with the stored hash

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    // Create a payload (you can add more info to the payload if needed)
    const payload = {
      userId: user._id,
      username: user.username
    };

    // Sign the JWT token (expires in 1 hour)
    const token = jwt.sign(payload, '0831', { expiresIn: '1h' });
  
    // Respond with the token
    res.json({ success: true, message: 'Login successful', token });
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//token for user 
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) return res.status(401).json({ success: false, message: 'Token required' });

  jwt.verify(token, '0831', (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });

    req.user = user; // Attach user info to request
    next(); // Proceed to the next middleware or route
  });
}


//authenticate token for post
app.post('/posts', authenticateToken, async (req, res) => {
  const { restaurantName, content, tag } = req.body;
  const author = req.user.username;

  if (!restaurantName || !content || !tag) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const newPost = new Post({ restaurantName, content, tag, author });
    await newPost.save();
    res.json({ success: true, message: 'Post created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating post: ' + error.message });
  }
});




//post logic
app.post('/posts', verifyToken, async (req, res) => {
  const { restaurantName, content, tag, author } = req.body;

  try {
    // Create a new post
    const newPost = new Post({
      restaurantName,
      content,
      tag,
      author,  // I could later link this to the User model
    });

    // Save the post to MongoDB
    await newPost.save();
    
    // Respond with success message
    res.json({ success: true, message: 'Post created successfully' });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ success: false, message: 'Error creating post: ' + err.message });
  }
});




 
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
