require("dotenv").config(); // Make sure you're loading environment variables

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs"); // Add bcrypt for password hashing
const User = require("./models/User"); // Import the User model
const Post = require("./models/Post"); // import user model

const jwt = require("jsonwebtoken"); // Ensure you have the JWT library

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
const PORT = 3000; // You can change this to any port you prefer

// Middleware to parse JSON data
app.use(express.json());

//Connect to MongoDB
mongoose
  .connect(
    MONGO_URI,    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )

  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Serve the main HTML file (signup.html or index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/posts/all", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Fetch all posts sorted by newest first
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/posts", async (req, res) => {
  const tag = req.query.tag; // e.g., "Chinese"
  try {
    const posts = await Post.find({ tag });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Server Error");
  }
});

///////////////////////////////////////////////////////////////////////////////////////

app.post("/signup", async (req, res) => {
  const { fullName, email, username, password } = req.body;

  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email or username already exists" });
    }

    const newUser = new User({
      fullName,
      email,
      username,
      password,
    });

    await newUser.save();
    res.json({ success: true, message: "User created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error creating user: " + err.message });
  }
});

// login
app.post("/login", async (req, res) => {
  console.log("Login route hit");
  const { username, password } = req.body;

  try {
    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }], // Search by both username or email
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password); // bcrypt.compare hashes the input password and compares it with the stored hash

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    // Create a payload (you can add more info to the payload if needed)
    const payload = {
      userId: user._id,
      username: user.username,
    };

    // Sign the JWT token (expires in 1 hour)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    // Respond with the token
    res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//token for user
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token)
    return res.status(401).json({ success: false, message: "Token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ success: false, message: "Invalid token" });

    req.user = user; // Attach user info to request
    next(); // Proceed to the next middleware or route
  });
}

//authenticate token for post
app.post("/posts", authenticateToken, async (req, res) => {
  const { restaurantName, content, tag } = req.body;
  const author = req.user.username;

  if (!restaurantName || !content || !tag) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const newPost = new Post({ restaurantName, content, tag, author });
    await newPost.save();
    res.json({ success: true, message: "Post created successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating post: " + error.message,
    });
  }
});


// Route to get posts for the logged-in user
app.get("/user/posts", authenticateToken, async (req, res) => {
  try {
    // Fetch posts by the logged-in user's username
    const posts = await Post.find({ author: req.user.username });
    res.json(posts); // Send the posts as a JSON response
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching posts: " + error.message,
    });
  }
});


//get user info
app.get('/api/user/:username', async (req, res) => {
  try {
    console.log('Fetching user:', req.params.username); // Debugging
    const user = await User.findOne({ username: req.params.username });

    if (user) {
      res.json({
        fullName: user.fullName,
        email: user.email,
        username: user.username,
      });
    } else {
      console.warn('User not found:', req.params.username);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});







//update password
app.post('/change-password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  try {
    //checking username to make sure proper user is being changed
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

   //hashing for new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating password: ' + err.message });
  }
});







// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});




