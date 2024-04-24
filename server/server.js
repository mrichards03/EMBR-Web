
import express from 'express'
import { handleMavLinkData } from './mavlinkHandler.mjs';

const app = express();
const port = 3000; 

//set up mavlink data handling 
handleMavLinkData();

//Object to store latest data 
let mavLinkData = {}; 

//create a route/path to expose data via API 
app.get('api/mavlink-data', (req, res) => {
    //get the latest processed data 
    //should we store data somewhere? 
    res.json(mavLinkData); 
});

//update the data when new is received
const updateMavLinkData = (data) => {
    mavLinkData = data; 
}

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export { updateMavLinkData };