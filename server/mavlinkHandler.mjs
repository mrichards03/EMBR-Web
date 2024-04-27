import { SerialPort } from "serialport";
import mavlink from "node-mavlink";
import fetch from "node-fetch";
import { updateMavLinkData } from "./server.mjs";

const {
  MavLinkPacketSplitter,
  MavLinkPacketParser,
  MavLinkPacketRegistry,
  minimal,
  common,
  ardupilotmega,
} = mavlink;

//create a registry of mappings between msg id and data
const REGISTRY = {
  ...minimal.REGISTRY,
  ...common.REGISTRY,
  ...ardupilotmega.REGISTRY,
};

// substitute /dev/ttyACM0 with your serial port!

function handleMavLinkData() {
  //serialPort.close();
  const portSerialNumber = "\\\\.\\COM5";

  const serialPort = new SerialPort({
    path: portSerialNumber,
    baudRate: 57600,
  });

  //constructing a reader that will emit each packet separately
  const mavlinkRead = serialPort
    .pipe(new MavLinkPacketSplitter())
    .pipe(new MavLinkPacketParser());
  console.log("hello from mavlink");
  //updateMavLinkData(1);

  //setup mavlink to listen for packets
  mavlinkRead.on("data", async (packet) => {
    const clazz = REGISTRY[packet.header.msgid];
    if (clazz) {
      const data = packet.protocol.data(packet.payload, clazz);
      //process the parsed data based on type
      switch (clazz.MSG_NAME) {
        case "GLOBAL_POSITION_INT":
          processGlobalPositionMessage(data);
          break;
        case "NAMED_VALUE_FLOAT":
          processCustomMessage(data);
          break;
        default:
          console.log("Unknown message type:", clazz.MSG_NAME);
      }
    }
  });

  mavlinkRead.on("error", (error) => {
    console.error("Error reading Mavlink data:", error);
  });
}

//process gps coordinates and send to server
function processGlobalPositionMessage(data) {
  const globalPositionData = {
    type: "global_position",
    timestamp: data.timeBootMs,
    latitude: data.lat / 1.0e7,
    longitude: data.lon / 1.0e7,
    altitude: data.alt / 1000.0,
    relativeAltitude: data.relative_alt / 1000.0,
    groundXSpeed: data.vx / 100.0,
    groundYSpeed: data.vy / 100.0,
    groundZSpeed: data.vz / 100.0,
    vehicleHeading: data.hdg / 100.0,
  };

  updateMavLinkData(globalPositionData);
}

function processCustomMessage(data) {
  if (data.name === "temp") {
    const TemperatureData = {
      type: "temp_data",
      timestamp: data.timeBootMs,
      temperature: data.value,
    };

    updateMavLinkData(TemperatureData);
  }
  if (data.name === "gas") {
    const SmokeData = {
      type: "smoke_data",
      timestamp: data.timeBootMs,
      smokeLevel: Math.round(data.value),
    };
    updateMavLinkData(SmokeData);
  }
}

export { handleMavLinkData };
