const socket = io();

const map = L.map('map').setView([25.343172, 81.9110302292521], 20);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Create a custom car icon
const carIcon = L.icon({
  iconUrl: 'car.png', // Path to your car icon
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
});

// Use the custom car icon for the vehicle marker
const vehicleMarker = L.marker([25.343172, 81.9110302292521], { icon: carIcon }).addTo(map);
const pathCoordinates = [[25.343172, 81.9110302292521]];
const polyline = L.polyline(pathCoordinates, { color: 'red' }).addTo(map);

socket.on('vehicleUpdate', (data) => {
  const { lat, lng ,ts} = data;
  vehicleMarker.bindPopup(`Timestamp: ${ts}`).openPopup();
  vehicleMarker.setLatLng([lat, lng]);
  pathCoordinates.push([lat, lng]);
  polyline.setLatLngs(pathCoordinates);
  map.panTo([lat, lng]);
});

