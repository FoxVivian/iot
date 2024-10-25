const { Sequelize } = require('sequelize');

// Thiết lập kết nối với cơ sở dữ liệu MySQL
const sequelize = new Sequelize('iot', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
});

// Kiểm tra kết nối
sequelize.authenticate()
  .then(() => console.log('Kết nối thành công đến MySQL với Sequelize'))
  .catch(err => console.error('Lỗi kết nối MySQL:', err));

module.exports = sequelize;
