import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

// Định nghĩa model Device
const Device = sequelize.define('Device', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  device_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'devices',  // Tên bảng trong cơ sở dữ liệu
  timestamps: false    // Bỏ qua các trường createdAt, updatedAt
});

export default Device;
