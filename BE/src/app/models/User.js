const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

// Định nghĩa model User
const User = sequelize.define('User', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  student_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'users',  // Tên bảng trong cơ sở dữ liệu
  timestamps: false    // Bỏ qua các trường createdAt, updatedAt
});

module.exports = User;
