const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Device Schema
const deviceSchema = new Schema({
  device_name: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    required: true
  }
}, {
  collection: 'devices', // Optional: specify the collection name in MongoDB
  timestamps: false       // No automatic createdAt/updatedAt fields
});

// Create Device model
const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
