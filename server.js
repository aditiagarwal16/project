// server.js
const express = require('express');
const app = express();
const mqtt = require('mqtt');

app.use(express.static('public')); // Serve static files from the "public" directory
app.use(express.json()); // For parsing application/json

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// MQTT Setup
const client = mqtt.connect('mqtt://localhost:1883'); // Connect to MQTT broker

client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

// Subscribe to the patient data topic
client.on('message', (topic, message) => {
    const patientData = JSON.parse(message.toString());
    // Logic to handle received patient data can be added here
});
