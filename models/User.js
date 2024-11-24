const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
      return next();
    }
    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);  // 10 is the salt rounds
    next();
  });

module.exports = mongoose.model('User', UserSchema);