const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Device = require('./Device')
const User = require('./User');

const Data_Device = sequelize.define('Data_Device', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    device_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Device,  // Liên kết với bảng Sensor
            key: 'id'
        }
    },
    action: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,  // Liên kết với bảng User
            key: 'id'
        }
    },
    time: {
        type: DataTypes.TIME,
    },
}, {
    tableName: 'data_devices',  // Tên bảng trong cơ sở dữ liệu
    timestamps: false    // Bỏ qua các trường createdAt, updatedAt
});

// Thiết lập quan hệ 1-nhiều giữa Device và Data_Device
Device.hasMany(Data_Device, { foreignKey: 'device_id' });
Data_Device.belongsTo(Device, { foreignKey: 'device_id', as: 'device'});

// Thiết lập quan hệ 1-nhiều giữa Device và Data_Device
User.hasMany(Data_Device, { foreignKey: 'user_id' });
Data_Device.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Data_Device;
