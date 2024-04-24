import './App.css';
import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import SmokeLineGraph from './smokeLineGraph';
import TemperatureGraph from './temperatureGraph';
import CameraStream from './fpvStream';
import { Line } from 'react-chartjs-2';

function App() {
  const [gpsData, setGpsData] = useState(null); 

  //effect to fetch GPS data from API
 useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:300/api/mavlink-data');
      if(!response.ok){
        throw new Error('failed to fecth Mavlink data');
      }

      const data = await response.json();
      setGpsData(data);
      
    } catch (error) {
      console.error('Error fetching mavlink data: ', error.message);
      
    }
  };

  fetchData(); 
 }, []);




  return (
    //state to store MAVLink gps data
    <div className='container-fluid h-100'>
      {/* Page Title */}
      <h1 className='title'>EMBR Dashboard</h1>

      <div className='row'>
        {/* Smoke Graph */}
        <div className='col smoke-graph-container '>
          <SmokeLineGraph />
          

        </div>

        {/* FPV camera feed */}
        <div className=' col fpv-container'>
          <CameraStream />

        </div>
        {/* Flir camera feed */}
        <div className='col flir-container'>

        </div>
        {/* Temperature camera feed */}
        <div className='col temp-graph-container'>
          <TemperatureGraph />

        </div>
        </div>

      <div className='row'>

      {/* Display GPS data */}
      <div className='gps-container'>
        <h2>Latest GPS Data</h2>
        {gpsData && (
          <div>
            <p>Latitude: {gpsData[gpsData.length - 1].latitude}</p>
            <p>Longitude: {gpsData[gpsData.length - 1].longitude}</p>
            {/* Display more GPS data fields as needed */}
          </div>
        )}
        </div>
      </div>
    </div>

  );
}

export default App;
