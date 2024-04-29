# Getting Started with EMBR Dashboard

The EMBR Dashboard is a web application designed to display real-time data from EMBR robot transmitted through MAVLink. EMBR is a robot that detect embers with the purpose of prevent wildfires. It provides a user-friendly interface for monitoring various parameters like GPS coordinates, temperature, and smoke levels.

## Features 
- Real-time display of GPS coordinates
- Visualization of temperature data
- Monitoring of smoke levels
- Live camera feed from ground stations

## Tecnologies Used
### Frontend:
React.js: JavaScript library for building user interfaces
Bootstrap: Frontend framework for responsive design
Fetch API: For making HTTP requests to the server

### Backend
Express.js: Web application framework for Node.js
Serialport: Library for serial port communication. Access [https://www.npmjs.com/package/node-mavlink](https://www.npmjs.com/package/node-mavlink) to view instruction on how to install the library.
Node.js: JavaScript runtime environment

### Other
MAVLink: Protocol for communicating with drones and ground control stations

## Getting Started
1. Clone the repository:
```
git clone https://github.com/your-username/embr-web.git
```

2. Install dependencies:
```
cd EMBR-Web
npm install
```

3. Start the server
```
cd server
npm start
```

4. Start the client
```
cd embr-app
npm start
```

4. Open the web application in your browser: 
```
http://localhost:3000
```

## Usage
1. Launch the web application in your browser.
2. Ensure that the MAVLink-enabled device is connected to the server. If needed change the serialport number in the server.mjs file.
3. The web application will display real-time data from the device, including GPS coordinates, temperature, and smoke levels.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode:

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
