const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const DB_URL = "mongodb+srv://neiryaeris:Fox01659943581@lab.7o83ceo.mongodb.net/IOT?retryWrites=true&w=majority&appName=Lab";


// Connect to MongoDB
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Kết nối thành công đến MongoDB'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

module.exports = mongoose;