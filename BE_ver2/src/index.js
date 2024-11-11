const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const mqttClient = require('./config/mqtt'); // create mqttClient connect to mqttBroker
const db = require('./config/database'); // create connect to mysql database

const route = require('./routes/_route');

const cors = require('cors');

const port = 6000;
const app = express();

// Cấu hình session
app.use(session({
    secret: 'alittledaisy', // Khóa bí mật để mã hóa session
    resave: false, // Không lưu session nếu không có thay đổi
    saveUninitialized: true, // Lưu session mới ngay cả khi nó chưa có dữ liệu
    cookie: { maxAge: 6000 * 5 } // Thời gian sống của session (ở đây là 5 phút)
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// http logger
app.use(morgan('combined'));

app.use(cors({
    origin: '*',  // Địa chỉ frontend của bạn
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Các phương thức được phép
    allowedHeaders: ['Content-Type', 'Authorization'],  // Header được phép
    credentials: true // Cho phép gửi cookie nếu cần
  }));

route(app);

app.listen(port, () => console.log(`App listening on port ${port}`));