const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true }, // Name of the restaurant
  content: { type: String, required: true }, // Post content
  tag: { type: String, required: true }, // Tag (e.g., Pizza, Burgers)
  author: { type: String, required: true }, // Author's username (can link to User schema)
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the post was created
});

module.exports = mongoose.model("Post", postSchema);
