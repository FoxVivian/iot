const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Data_Sensor = sequelize.define('Data_Sensor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    temperature: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    humidity: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    light: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
    },
}, {
    tableName: 'data_sensors',  // Tên bảng trong cơ sở dữ liệu
    timestamps: false    // Bỏ qua các trường createdAt, updatedAt
});

module.exports = Data_Sensor;
