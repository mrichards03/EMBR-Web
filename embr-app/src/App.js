import "./App.css";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SmokeLineGraph from "./smokeLineGraph";
import TemperatureGraph from "./temperatureGraph";
import CameraStream from "./fpvStream";
import logo from "./res/Logo-01.png"

function App() {
  const [gpsData, setGpsData] = useState(null);

  //effect to fetch GPS data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/mavlink-data');
        if (!response.ok) {
          throw new Error("failed to fecth Mavlink data");
        }

        const data = await response.json();
        setGpsData(data);
      } catch (error) {
        console.error("Error fetching mavlink data: ", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    //state to store MAVLink gps data
    
    <div className="dashboard-container">
      <div className="row">
      <div className="col-lg-3 justify-content-end logo-container">
        <img src={logo} alt="Logo" className="logo float-right"/>
      </div>
      <div className="col-lg-6 title-container">
        <h1 className="title">EMBR Dashboard</h1>
      </div>
      </div>
      <div className="container-fluid h-100">
        {/* Page Title */}

        <div className="row">
          {/* Smoke Graph */}
          <div className="col smoke-graph-container ">
            <SmokeLineGraph />
          </div>

          {/* FPV camera feed */}
          <div className=" col fpv-container">
            <CameraStream />
          </div>
          {/* Flir camera feed */}
          <div className="col flir-container">
          <CameraStream />
          </div>
          {/* Temperature camera feed */}
          <div className="col temp-graph-container">
            <TemperatureGraph />
          </div>
        </div>

        <div className="row">
          {/* Display GPS data */}
          <div className="col empty-container"></div>
          <div className="col empty-container"></div>
          <div className="col empty-container"></div>
          <div className="col gps-container">
            <h2>Latest GPS Data</h2>
            <h5>Latitude: 48G </h5>
            <h5>Longitude: 49G </h5>
            {gpsData && (
              <div>
                <h3>Latitude: {gpsData[gpsData.length - 1].latitude}</h3>
                <h3>Longitude: {gpsData[gpsData.length - 1].longitude}</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
