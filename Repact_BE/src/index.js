const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const mqttClient = require('./config/mqtt'); // create mqttClient to connect to mqttBroker
const db = require('./config/database'); // MongoDB connection using Mongoose
const route = require('./routes/_route');
const cors = require('cors');

const port = 3000;
const app = express();

// Cấu hình session
app.use(session({
    secret: 'alittledaisy', 
    resave: false, 
    saveUninitialized: true, 
    cookie: { maxAge: 6000 * 5 } 
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTTP logger
app.use(morgan('combined'));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Routes setup
route(app);

// Start server
app.listen(port, () => console.log(`App listening on port ${port}`));
