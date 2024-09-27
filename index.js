const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs'); // Import the fs module

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('New client connected');

  // Read the JSON file
  fs.readFile('location-data.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    
    const locations = JSON.parse(data);
    let index = 0;
    

    // Set initial lat and lng from the first location in the JSON file
    let lat = locations[index].lat;
    let lng = locations[index].lng;
    let ts=locations[index].ts;
    // Set an interval to send location updates every 5 seconds
    const interval = setInterval(() => {
      if (index < locations.length) {
        lat += (Math.random() - 0.5) * 0.001;
    lng += (Math.random() - 0.5) * 0.001;
    socket.emit('vehicleUpdate', { lat, lng,ts });
       

        index++;
      } else {
        clearInterval(interval); // Stop sending updates when done
      }
    }, 1000); 
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
