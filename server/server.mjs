
import express from 'express'
import cors from 'cors';
import { handleMavLinkData } from './mavlinkHandler.mjs';

const app = express();
const port = 3000; 

//set up mavlink data handling 
handleMavLinkData();

//Object to store latest data 
let mavLinkData = []; 

app.use(cors({
    origin: 'http://localhost:3001', // Allow requests only from this origin
    methods: 'GET,POST', // Allow only specified HTTP methods
    credentials: true // Allow cookies to be sent cross-origin
  }));

//create a route/path to expose data via API 
app.get('/api/mavlink-data', (req, res) => {
    //get the latest processed data 
    //should we store data somewhere? 
    res.json(mavLinkData); 
});

//update the data when new is received
function updateMavLinkData (data) {
    mavLinkData.push(data); // Append new data to the array
    console.log(data);
}

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export { updateMavLinkData };