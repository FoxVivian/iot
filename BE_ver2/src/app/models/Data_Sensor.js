const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Data_Sensor Schema
const dataSensorSchema = new Schema({
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  light: {
    type: Number,
    required: true
  },
  time: {
    type: String,  // Storing time as a string in MongoDB (e.g., 'HH:mm:ss')
    required: false
  }
}, {
  collection: 'data_sensors',  // Optional: specify the collection name in MongoDB
  timestamps: false            // No automatic createdAt/updatedAt fields
});

// Create Data_Sensor model
const Data_Sensor = mongoose.model('Data_Sensor', dataSensorSchema);

module.exports = Data_Sensor;
