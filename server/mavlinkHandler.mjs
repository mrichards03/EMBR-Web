import SerialPort from 'serialport'
import mavlink from 'node-mavlink'
import fetch from 'node-fetch'; 
import { updateMavLinkData } from './server.mjs';


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
const portSerialNumber = 'COM5';

function handleMavLinkData()  {
    const port = new SerialPort(portSerialNumber, {
        baudRate: 57600, 
        path: portSerialNumber
    });

    // constructing a reader that will emit each packet separately
    const mavlinkRead = SerialPort.pipe(new MavLinkPacketSplitter()).pipe(new MavLinkPacketParser()); 
    
    //setup mavlink to listen for packets
    mavlinkRead.on('data', packet => {
        const clazz = REGISTRY[packet.header.msgid]; 
        if(clazz) {
            const data = packet.protocol.data(packet.payload, clazz);

            //process the parsed data based on type
            switch(clazz.name){
                case 'GPS_POSITION_INT':
                    processGlobalPositionMessage(data);
                    break; 
                case 'NAMED_FLOAT':
                    processCustomMessage(data); 
                    break; 
            }

            //send parsed data to the server
            sendMavLinkDataToServer(data);  
        }
    });
};

//process gps coordinates and send to server
function processGlobalPositionMessage (data) {

    const globalPositionData = {
        timestamp: data.time._boot_ms, 
        latitude: data.lat / 1.0e7,
        longitude: data.lon / 1.0e7,
        altitude: data.alt / 1000.0,
        relativeAltitude: data.relative_alt / 1000.0,
        groundXSpeed: data.vx / 100.0,
        groundYSpeed: data.vy / 100.0,
        groundZSpeed: data.vz / 100.0,
        vehicleHeading: data.hdg / 100.0
    };

    updateMavLinkData(globalPositionData);
}

function processCustomMessage (data) {

    const SmokeTemperatureData = {
        timestamp: data.time._boot_ms,
        smokeLevel: data.gas,
        temperature: data.temp
    }
    updateMavLinkData(SmokeTemperatureData);
};

export { handleMavLinkData }; 