import "./App.css";
// import Button from "react-bootstrap/Button";
// import Modal from "react-bootstrap/Modal";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, //x axis
  LinearScale, //y axis
  PointElement,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend);


function SmokeLineGraph() {
  const [smokeData, setSmokeData] = useState(null); 

  useEffect(() => {
    //fetch smoke data from the api 
    fetch('http://localhost:3000/api/mavlink-data')
    .then(response => {
      if(!response.ok){
        throw new Error('Failed to fetch smoke data'); 
      }
      return response.json();

    })
    .then(data => {
      const smokeEntries = data.filter(entry => entry.type === 'smoke_data');
      const smokeLabels = smokeEntries.map(entry => entry.timestamp / 1000);
      const smokeDataMap = smokeEntries.map(entry => entry.smokeLevel); 
      
      //parse the response to populate the graph
      const smokeData = {
        labels: smokeLabels,
        datasets: [
        {
          label: 'Smoke Level',
          data: smokeDataMap,
          fill: false,
          borderColor: '#EE2A24',
          backgroundColor: '#F8B522',
          pointBorderColor: '#EE2A24',
          tension: 0.1
        }
      ]
      };
      setSmokeData(smokeData);

    })
    .catch(error => {
      console.error('Error fetching smoke data:', error); 
    })
  })

      const options = {
        plugins: {
          Legend: true,
        },
        scales: {
          y: {
            min: 10000,
            max: 250000,
            gridLines: {
              display: false,
              color: "transparent",
            },
          },
          x: {
            gridLines: {
              display: false,
              color: "transparent",
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      }
  
    return (
      <div className='smoke-graph'>
        {smokeData && <Line data={smokeData} options = {options} />}
      </div>
    );
  };

export default SmokeLineGraph; 