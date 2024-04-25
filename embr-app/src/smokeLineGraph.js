import './App.css';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale, //x axis
    LinearScale, //y axis
    PointElement,
    Legend
} from 'chart.js';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Legend
)


function SmokeLineGraph() {
  const [smokeData, setSmokeData] = useState(null); 

  useEffect(() => {
    //fetch smoke data from the api 
    fetch('http://localhost:300/api/mavlink-data')
    .then(response => response.json())
    .then(data => {
      //parse the response to populate the graph
      const smokeData = {
        labels: data.map(entry => entry.timestamp),
        datasets: [
        {
          label: 'Smoke Level',
          data: data.map(entry => entry.smokeLevel),
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

      // Fake data for demonstration
      // const data = {
      //   labels: ['5 minutes', '10 minutes', '15 minutes', '20 minutes', '25 minutes', '30 minutes', '35 minutes'],
      //   datasets: [
      //     {
      //       label: 'Smoke Data',
      //       data: [65, 59, 80, 81, 56, 55, 40],
      //       fill: false,
      //       borderColor: '#EE2A24',
      //       backgroundColor: '#F8B522',
      //       pointBorderColor: '#EE2A24',
      //       tension: 0.1
      //     },
      //   ],
      // };

      const options = {
        plugins: {
            Legend: true
        }, 
        scales: {
            y: {
                min: 40,
                max: 85
            }
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