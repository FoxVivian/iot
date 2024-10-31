const { Sequelize } = require('sequelize');

// Thiết lập kết nối với cơ sở dữ liệu MySQL
const sequelize = new Sequelize('iot', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
});


// const sequelize = new Sequelize('iot', 'root', '1234', {
//   host: '192.168.96.205',
//   dialect: 'mysql'
// });


// Kiểm tra kết nối
sequelize.authenticate()
  .then(() => console.log('Kết nối thành công đến MySQL với Sequelize'))
  .catch(err => console.error('Lỗi kết nối MySQL:', err));

module.exports = sequelize;
