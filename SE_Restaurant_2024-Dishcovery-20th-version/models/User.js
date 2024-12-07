const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Check if the password is already hashed
  const isHashed = /^\$2[aby]\$[\d]+\$/.test(this.password); // bcrypt hashed passwords start with $2a$, $2b$, or $2y$
  if (!isHashed) {
    this.password = await bcrypt.hash(this.password, 10); // Hash the password
  }

  next();
});


module.exports = mongoose.model('User', UserSchema);
