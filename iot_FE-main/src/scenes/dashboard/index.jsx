import { Box, IconButton, Typography, useTheme, CircularProgress } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";

import StatBox from "../../components/StatBox";

import LightModeIcon from '@mui/icons-material/LightMode';
import CloudIcon from '@mui/icons-material/Cloud';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { green } from '@mui/material/colors';
import Switch from '@mui/material/Switch';

import LightbulbIcon from '@mui/icons-material/Lightbulb';

import { useState, useEffect } from 'react';


const Dashboard = ({ dataSensors = {}, dataDevices = {}, sendControlData }) => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState({ "1": false, "2": false, "3": false });

  // Theo dõi sự thay đổi của dataDevices["1"]
  useEffect(() => {
    if (loading["1"]) {
      setLoading((prevLoading) => ({
        ...prevLoading,
        "1": false, // Khi dataDevices["1"] thay đổi thì tắt loading của nó
      }));
    }
  }, [dataDevices["1"]]);

  // Theo dõi sự thay đổi của dataDevices["2"]
  useEffect(() => {
    if (loading["2"]) {
      setLoading((prevLoading) => ({
        ...prevLoading,
        "2": false, // Khi dataDevices["2"] thay đổi thì tắt loading của nó
      }));
    }
  }, [dataDevices["2"]]);

  // Theo dõi sự thay đổi của dataDevices["3"]
  useEffect(() => {
    if (loading["3"]) {
      setLoading((prevLoading) => ({
        ...prevLoading,
        "3": false, // Khi dataDevices["3"] thay đổi thì tắt loading của nó
      }));
    }
  }, [dataDevices["3"]]);
  console.log(dataDevices);
  // Hàm xử lý bật tắt switch và gửi control data cho mỗi phần tử
  const handleChange = (id) => (event) => {
    const checked = event.target.checked;
    setLoading((prevLoading) => ({
      ...prevLoading,
      [id]: true, // Hiển thị loading chỉ cho phần tử tương ứng
    }));
    sendControlData({ [id]: checked ? 1 : 0 });
  };

  const GreenSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: green[300],
      '&:hover': {
        backgroundColor: alpha(green[300], theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: green[300],
    },
  }));

  const RedSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: red[300],
      '&:hover': {
        backgroundColor: alpha(red[300], theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: red[300],
    },
  }));

  const label = { inputProps: { 'aria-label': 'Color switch demo' } };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="IOT DASHBOARD" subtitle="Light, Heat and Humidity Sensor Report" />

        {/* self introduction ??? */}

      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${dataSensors[2].data[9].y} °C`}
            subtitle="HEAT"
            progress={`${dataSensors[2].data[9].y / 100}`}
            increase={`${(dataSensors[2].data[9].y - dataSensors[2].data[8].y).toFixed(2)}`}
            icon={
              <DeviceThermostatIcon
                sx={{ color: colors.redAccent[600], fontSize: "26px" }}
              />
            }
            colorSubtitle={colors.redAccent[400]}
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${dataSensors[0].data[9].y} %`}
            subtitle="LIGHT"
            progress={`${dataSensors[0].data[9].y / 100}`}
            increase={`${(dataSensors[0].data[9].y - dataSensors[0].data[8].y).toFixed(2)}`}
            icon={
              <LightModeIcon
                sx={{ color: colors.yellowAccent[600], fontSize: "26px" }}
              />
            }
            colorSubtitle={colors.yellowAccent[400]}
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${dataSensors[1].data[9].y} %`}
            subtitle="HUMIDITY"
            progress={`${dataSensors[1].data[9].y / 100}`}
            increase={`${(dataSensors[1].data[9].y - dataSensors[1].data[8].y).toFixed(2)}`}
            icon={
              <CloudIcon
                sx={{ color: colors.blueAccent[600], fontSize: "26px" }}
              />
            }
            colorSubtitle={colors.blueAccent[400]}
          />
        </Box>


        {/* ROW 2 */}
        <Box
          gridColumn="span 9"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
        // height="540px"
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Heat, Light, Humidity Chart on time
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <HistoryToggleOffIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="480px" m="-20px 0 0 0">
            <LineChart isDashboard={true} dataSensors={dataSensors} />
          </Box>
        </Box>

        <Box
          gridColumn="span 3"
          gridRow="span 2"
          display="grid"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              CONTROL PANEL
            </Typography>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)" // Tạo 3 cột có kích thước bằng nhau
            alignItems="center" // Căn giữa các phần tử theo chiều dọc
            borderBottom={`2px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Box display="flex" justifyContent="center">
              <Typography
                color={colors.yellowAccent[500]}
                variant="h5"
                fontWeight="600"
              >
                LED 1
              </Typography>
            </Box>

            <Box display="flex" justifyContent="center">
              <IconButton>
                <LightbulbIcon
                  sx={{ fontSize: "30px", color: dataDevices["1"] === 1 ? colors.yellowAccent[500] : colors.primary[800] }}
                />
              </IconButton>
            </Box>

            <Box display="flex" justifyContent="center">
              {loading["1"] ? (
                <CircularProgress size={32} color="warning" />
              ) : (
                <Switch
                  color="warning"
                  checked={dataDevices["1"] === 1}
                  onChange={handleChange("1")}
                />
              )}
            </Box>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)" // Tạo 3 cột có kích thước bằng nhau
            alignItems="center" // Căn giữa các phần tử theo chiều dọc
            borderBottom={`2px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Box display="flex" justifyContent="center">
              <Typography
                color={colors.redAccent[500]}
                variant="h5"
                fontWeight="600"
              >
                LED 2
              </Typography>
            </Box>

            <Box display="flex" justifyContent="center">
              <IconButton>
                <LightbulbIcon
                  sx={{ fontSize: "30px", color: dataDevices["2"] === 1 ? colors.redAccent[500] : colors.primary[800] }}
                />
              </IconButton>
            </Box>

            <Box display="flex" justifyContent="center">
              {loading["2"] ? (
                <CircularProgress size={32} color="error" />
              ) : (
                <RedSwitch
                  checked={dataDevices["2"] === 1}
                  onChange={handleChange("2")}
                />
              )}
            </Box>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)" // Tạo 3 cột có kích thước bằng nhau
            alignItems="center" // Căn giữa các phần tử theo chiều dọc
            borderBottom={`2px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Box display="flex" justifyContent="center">
              <Typography
                color={colors.greenAccent[500]}
                variant="h5"
                fontWeight="600"
              >
                LED 3
              </Typography>
            </Box>

            <Box display="flex" justifyContent="center">
              <IconButton>
                <LightbulbIcon
                  sx={{ fontSize: "30px", color: dataDevices["3"] === 1 ? colors.greenAccent[500] : colors.primary[800] }}
                />
              </IconButton>
            </Box>

            <Box display="flex" justifyContent="center">
              {loading["3"] ? (
                <CircularProgress size={32} color="success" />
              ) : (
                <GreenSwitch
                  checked={dataDevices["3"] === 1}
                  onChange={handleChange("3")}
                />
              )}
            </Box>
          </Box>

        </Box>

      </Box>
    </Box>
  );
};

export default Dashboard;


