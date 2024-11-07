import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/aboutme/calendar";
import History from "./scenes/devices/History";
import Login from "./scenes/login/index";
import useSocket from './hooks/useSocket';


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const {dataSensors, dataDevices, sendControlData} = useSocket();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard dataSensors={dataSensors} dataDevices={dataDevices} sendControlData={sendControlData}/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/team" element={<Team />} />
              <Route path="/devices" element={<History />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/aboutme" element={<Calendar />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
