const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Data_Device Schema
const dataDeviceSchema = new Schema({
  device_id: {
    type: Schema.Types.ObjectId,  // Reference to Device model
    ref: 'Device',
    required: true
  },
  action: {
    type: Number,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,  // Reference to User model
    ref: 'User',
    required: true
  },
  time: {
    type: String,  // Store time as a string in 'HH:mm:ss' format or as a Date if including the date
    required: false
  }
}, {
  collection: 'data_devices', // Optional: specify collection name in MongoDB
  timestamps: false           // No automatic createdAt/updatedAt fields
});

// Create Data_Device model
const Data_Device = mongoose.model('Data_Device', dataDeviceSchema);

module.exports = Data_Device;
