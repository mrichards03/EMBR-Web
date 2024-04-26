import { SerialPort } from 'serialport'
import mavlink from 'node-mavlink'
import fetch from 'node-fetch'; 
import { updateMavLinkData } from './server.mjs'


const {
  MavLinkPacketSplitter,
  MavLinkPacketParser,
  MavLinkPacketRegistry,
  minimal,
  common,
  ardupilotmega
} = mavlink;

//create a registry of mappings between msg id and data 
const REGISTRY = {
    ...minimal.REGISTRY,
    ...common.REGISTRY,
    ...ardupilotmega.REGISTRY,
  };

// substitute /dev/ttyACM0 with your serial port!

async function handleMavLinkData()  {
    //serialPort.close();
    const portSerialNumber = '\\\\.\\COM5';

    const serialPort = new SerialPort({ path: portSerialNumber, baudRate: 57600 });

    //constructing a reader that will emit each packet separately
    const mavlinkRead = serialPort.pipe(new MavLinkPacketSplitter()).pipe(new MavLinkPacketParser());
    console.log("hello from mavlink"); 
    //updateMavLinkData(1);
    
    
    //setup mavlink to listen for packets
    mavlinkRead.on('data', async packet => {
        console.log(packet); 
        console.log(typeof packet);
        console.log("hello from out");
        const clazz = REGISTRY[packet.header.msgid]; 
        if(clazz) {
            const data = packet.protocol.data(packet.payload, clazz);
            console.log(typeof data);
            console.log('Received packet:', data);
            console.log("hello from inside");
            
            //process the parsed data based on type
            switch(clazz.type){
                case 'GPS_POSITION_INT':
                    await processGlobalPositionMessage(data);
                    break; 
                    case 'NAMED_FLOAT':
                        await processCustomMessage(data); 
                        break; 
                        default:
                            console.log('Unknown message type:', clazz.name);
                        }
                        await sendMavLinkDataToServer(data);
                    }
                });
                
                mavlinkRead.on('error', error => {console.error('Error reading Mavlink data:', error);})
                
            };
            
            //process gps coordinates and send to server
            function processGlobalPositionMessage (data) {

                const globalPositionData = {
                    type: 'global_position',
                    // timestamp: data.time._boot_ms, 
                    // latitude: data.lat / 1.0e7,
                    // longitude: data.lon / 1.0e7,
                    // altitude: data.alt / 1000.0,
                    // relativeAltitude: data.relative_alt / 1000.0,
                    // groundXSpeed: data.vx / 100.0,
                    // groundYSpeed: data.vy / 100.0,
                    // groundZSpeed: data.vz / 100.0,
                    // vehicleHeading: data.hdg / 100.0
    };
    
    updateMavLinkData(globalPositionData);
    console.log(updateMavLinkData(globalPositionData));
}

function processCustomMessage (data) {
    
    const SmokeTemperatureData = {
        type: 'smoke_temp',
        // timestamp: data.time._boot_ms,
        // smokeLevel: data.gas,
        // temperature: data.temp
    }


    
    updateMavLinkData(SmokeTemperatureData);
};

// Function to send data to the server
async function sendMavLinkDataToServer(data) {
    try {
        const response = await fetch('http://localhost:3000/api/mavlink-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            // If response is not ok, throw an error with detailed information
            const errorMessage = `Failed to send MAVLink data to server. Status: ${response.status}, Message: ${response.statusText}`;
            throw new Error(errorMessage);
        }
        
        // If the response is successful, return the response JSON
        return response.json();
    } catch (error) {
        // Propagate the error to the caller
        throw error;
    }
}



export { handleMavLinkData }; 