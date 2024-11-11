const User = require("../models/User"); // Model User
const Device = require("../models/Device"); // Model Device
const Sensor = require("../models/Sensor"); // Model Sensor
const Data_Sensor = require("../models/Data_Sensor"); // Model Data Sensor
const Data_Device = require("../models/Data_Device"); // Model Data Device
const jwt = require("jsonwebtoken");
const { Sequelize, Op } = require("sequelize"); // Model

class ApiController {
  // [GET] /api/data/users
  async users(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["username", "password"] }, // Loại bỏ trường password
      });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // [GET] /api/data/devices
  async devices(req, res, next) {
    try {
      const devices = await Device.findAll();
      res.json(devices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // [GET] /api/data/sensors
  async sensors(req, res, next) {
    try {
      const sensors = await Sensor.findAll();
      res.json(sensors);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // [GET] /api/data/data_sensors
  async data_sensors(req, res, next) {
    try {
      const { page = 1, pageSize = 100, searchText = "", startDate, endDate } = req.query; // Mặc định là trang 1 và pageSize 100
      const offset = (page - 1) * pageSize;
      const whereClause = {};

      // Nếu có searchText, tìm kiếm trong các trường temperature, humidity, light
      if (searchText) {
        whereClause[Op.or] = [
          { temperature: { [Op.like]: `%${searchText}%` } },
          { humidity: { [Op.like]: `%${searchText}%` } },
          { light: { [Op.like]: `%${searchText}%` } },
          { time: { [Op.like]: `%${searchText}%` } },
        ];
      }

      // Nếu có startDate và endDate, thêm điều kiện lọc theo thời gian
      if (startDate && endDate) {
        whereClause.time = {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        };
      }

      const { count, rows } = await Data_Sensor.findAndCountAll({
        where: whereClause,
        limit: parseInt(pageSize, 10), // Giới hạn số lượng kết quả
        offset: parseInt(offset, 10), // Bỏ qua số lượng kết quả trước đó
        order: [["time", "DESC"]], // Sắp xếp theo time giảm dần
      });

      res.json({
        total: count,
        items: rows,
      });
    } catch (error) {
      next(error);
    }
  }

  // [GET] /api/data/data_devices
  async data_devices(req, res, next) {
    try {
      const { page = 1, pageSize = 100, searchText = "", selectedAction = "", startDate, endDate } = req.query; // Mặc định là trang 1 và kích thước 25
      const offset = (page - 1) * pageSize; // Tính toán offset
      const whereClause = {};

      // Nếu có searchText, tìm kiếm trong các trường liên quan
      if (searchText) {
        whereClause[Op.or] = [
          Sequelize.literal(`device.device_name LIKE '%${searchText}%'`), // Tìm kiếm trong device_name
          { action: { [Op.like]: `%${searchText}%` } }, // Tìm kiếm trong action
        ];
      }

      // Nếu có selectedAction, thêm điều kiện cho action
      if (selectedAction) {
        whereClause.action = selectedAction;
      }

      if (startDate && endDate) {
        whereClause.time = {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        };
      }

      const { count, rows } = await Data_Device.findAndCountAll({
        where: whereClause,
        limit: parseInt(pageSize, 10), // Giới hạn số lượng kết quả
        offset: parseInt(offset, 10), // Bỏ qua số lượng kết quả trước đó
        include: [
          {
            model: Device, // Thực hiện join với bảng Device
            as: "device", // Đặt alias là 'device'
            attributes: ["device_name"], // Lấy trường device_name từ bảng devices
          },
        ],
        order: [["time", "DESC"]],
        raw: true,
      });
      // rows.device_name = rows.device.device_name;
      res.json({
        total: count,
        items: rows,
      });
    } catch (error) {
      next(error);
    }
  }

  test(req, res, next) {
    if (req.session.views) {
      req.session.views++;
      res.send(`<p>Số lần bạn đã truy cập trang này: ${req.session.views}</p>`);
    } else {
      req.session.views = 1;
      res.send("Chào mừng bạn lần đầu tiên truy cập! Hãy tải lại trang.");
    }
  }

  // [POST] /api/login
  // async login(req, res, next) {
  //     const { username, password } = req.body;

  //     try {
  //         // Tìm người dùng trong cơ sở dữ liệu
  //         const user = await User.findOne({ where: { username } });

  //         if (!user) {
  //             return res.status(404).json({ message: 'User not found' });
  //         }

  //         // Kiểm tra mật khẩu
  //         if (!(password === user.password)) {
  //             // console.log(password);
  //             return res.status(401).json({ message: 'Invalid password' });
  //         }

  //         // Tạo JWT token
  //         const token = jwt.sign({ id: user.id }, 'alittledaisy_token', { expiresIn: '24h' }); // Nên sử dụng biến môi trường cho secret key

  //         res.status(200).json({
  //             token,
  //             message: "Login successfully",
  //         });
  //     } catch (error) {
  //         next(error);
  //     }
  // }
  async login(req, res, next) {
    const { username, password } = req.body;
    console.log("Received username:", username);

    try {
      // Corrected query for Mongoose
      const user = await User.findOne({ username: username });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check the password
      if (password !== user.password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Create JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "alittledaisy_token", { expiresIn: "24h" }); // Use environment variable for secret key in production

      res.status(200).json({
        token,
        message: "Login successfully",
      });
      console.log("Login successfully")
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ApiController();
