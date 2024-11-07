const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Sensor Schema
const sensorSchema = new Schema({
  sensor_name: {
    type: String,
    required: true
  }
}, {
  collection: 'sensors', // Optional: specify the collection name in MongoDB
  timestamps: false       // No automatic createdAt/updatedAt fields
});

// Create Sensor model
const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;
