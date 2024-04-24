import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale, //x axis
    LinearScale, //y axis
    PointElement,
    plugins,
    Legend
} from 'chart.js';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
)


function SmokeLineGraph() {

      // Fake data for demonstration
      const data = {
        labels: ['5 minutes', '10 minutes', '15 minutes', '20 minutes', '25 minutes', '30 minutes', '35 minutes'],
        datasets: [
          {
            label: 'Smoke Data',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'black',
            backgroundColor: 'white',
            tension: 0.1
          },
        ],
      };

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
        <Line data={data} options = {options} />
      </div>
    );
  };

export default SmokeLineGraph; 