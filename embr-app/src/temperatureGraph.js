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

function TemperatureGraph() {
  const [tempData, setTempData] = useState(null);
  // const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    //fetch smoke data from the api
    fetch("http://localhost:3000/api/mavlink-data")
      .then((response) => response.json())
      .then((data) => {
        //parse the response to populate the graph
        const tempData = {
          labels: data.map((entry) => entry.timestamp),
          datasets: [
            {
              label: "Smoke Level",
              data: data.map((entry) => entry.temperature),
              fill: false,
              borderColor: "#F8B522",
              backgroundColor: "#EE2A24",
              pointBorderColor: "#F8B522",
              tension: 0.1,
            },
          ],
        };
        setTempData(tempData);

        // const threshold = 50;
        // const latestTempLevel = tempData[tempData.length - 1].temperature;
        // if (latestTempLevel > threshold) {
        //   //alert('Smoke level exceed 50C!');
        //   setShowModal(true);
        // }
      })
      .catch((error) => {
        console.error("Error fetching temperature data:", error);
      });
  });

  // Fake data for demonstration
  // const data = {
  //   labels: ['5 minutes', '10 minutes', '15 minutes', '20 minutes', '25 minutes', '30 minutes', '35 minutes'],
  //   datasets: [
  //     {
  //       label: 'Temperature Data',
  //       data: [65, 59, 80, 81, 56, 55, 40],
  //       fill: false,
  //       borderColor: '#F8B522',
  //       backgroundColor: '#EE2A24',
  //       pointBorderColor: '#F8B522',
  //       tension: 0.1
  //     },
  //   ],
  // };

  const options = {
    plugins: {
      Legend: true,
    },
    scales: {
      y: {
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
  };

  // Destroy previous chart instance if exists
  return (
    <div className="smoke-graph">
      {tempData && <Line data={tempData} options={options} />}

      {/* Modal component */}
      {/* <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            EMBR Alert
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>
            Caution
          </h4>
          <p>
             Smoke level exceed 50°C!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button >
            Close
            </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
}

export default TemperatureGraph;
