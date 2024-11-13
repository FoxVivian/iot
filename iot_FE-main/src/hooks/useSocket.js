import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'; // Thư viện để lấy cookies
import { tokens } from "../theme";
import moment from "moment";  // For formatting timestamps
import axios from 'axios';
// Đảm bảo URL chính xác với port của backend

const token = Cookies.get('token'); // Lấy token từ cookie

const xValues = ["-9", "-8", "-7", "-6", "-5", "-4", "-3", "-2", "-1", "now"];
var lightYValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var humidityYValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var heatYValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const createData = (id, color, yValues) => {
  return {
    id,
    color,
    data: xValues.map((x, index) => ({
      x,
      y: yValues[index]
    })),
  };
};

const useSocket = () => {
  const [dataSensors, setDataSensors] = useState([
    createData("LIGHT", tokens("dark").yellowAccent[500], lightYValues),
    createData("HUMIDITY", tokens("dark").blueAccent[300], humidityYValues),
    createData("HEAT", tokens("dark").redAccent[300], heatYValues),
  ]);
  const [dataDevices, setDataDevices] = useState({
    "1": 0,
    "2": 0,
    "3": 0
  });

  const fetchDataSensors = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/realtime/api/data/data_sensors`);

      const now = new Date();  // Get current time
      const formattedTime = moment(now).format("HH:mm:ss");

      const light = response.data["l"];
      const humidity = response.data["h"];
      const heat = response.data["t"];

      lightYValues.push(light);
      humidityYValues.push(humidity);
      heatYValues.push(heat);
      xValues.push(formattedTime);

      if (lightYValues.length > 10) {
        lightYValues.shift();
      }
      if (humidityYValues.length > 10) {
        humidityYValues.shift();
      }
      if (heatYValues.length > 10) {
        heatYValues.shift();
      }
      if (xValues.length > 10) {
        xValues.shift();
      }

      const newDataSensors = [
        createData("LIGHT", tokens("dark").yellowAccent[500], lightYValues),
        createData("HUMIDITY", tokens("dark").blueAccent[300], humidityYValues),
        createData("HEAT", tokens("dark").redAccent[300], heatYValues),
      ];

      setDataSensors(newDataSensors);

      console.log(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchDataDevices = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/realtime/api/data/data_devices`);
      setDataDevices(response.data); // Cập nhật state với dữ liệu nhận được
    } catch (error) {
      console.error("Error fetching data devices:", error);
    }
  }
  useEffect(() => {
    fetchDataDevices();
    const fetchDataInterval = setInterval(fetchDataSensors, 1000); // Gọi API mỗi 1 giây

    return () => clearInterval(fetchDataInterval);
  }, []);

  const sendControlData = async (controlData) => {
    try {
      const response = await axios.post(`http://localhost:5000/realtime/api/control/device`, {...controlData, token});
      setDataDevices(response.data);
      console.log(response);
    } 
    catch (error) {
      console.error('Error sending control data:', error.response ? error.response.data : error.message);
    }
  };

  return { dataSensors, dataDevices, sendControlData };
};

export default useSocket;
