const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define User Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  student_id: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}, {
  collection: 'users',  // Optional: define collection name in MongoDB
  timestamps: false     // No automatic createdAt/updatedAt fields
});

// Create User model
const User = mongoose.model('Users', userSchema);

module.exports = User;
