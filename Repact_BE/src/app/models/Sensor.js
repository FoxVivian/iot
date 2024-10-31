import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

// Định nghĩa model Sensor
const Sensor = sequelize.define('Sensor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sensor_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'sensors',  // Tên bảng trong cơ sở dữ liệu
  timestamps: false    // Bỏ qua các trường createdAt, updatedAt
});

export default Sensor;
