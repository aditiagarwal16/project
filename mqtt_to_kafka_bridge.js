// mqtt_to_kafka_bridge.js

const mqtt = require('mqtt');
const kafka = require('kafka-node');

// MQTT broker configuration
const mqttOptions = {
    host: 'localhost',  // Mosquitto broker host
    port: 1883,         // Mosquitto broker port
};

const kafkaBroker = 'localhost:9092'; // Kafka broker
const kafkaTopic = 'sensor_data';      // Kafka topic to which messages will be sent

// Create MQTT client
const mqttClient = mqtt.connect(mqttOptions);

// Create Kafka client and producer
const kafkaClient = new kafka.KafkaClient({ kafkaHost: kafkaBroker });
const producer = new kafka.Producer(kafkaClient);

// Handle Kafka producer ready event
producer.on('ready', () => {
    console.log('Kafka Producer is connected and ready.');
});

// Handle Kafka producer error event
producer.on('error', (err) => {
    console.error('Error with Kafka Producer:', err);
});

// Connect to the MQTT broker
mqttClient.on('connect', () => {
    console.log('Connected to Mosquitto MQTT broker');
    // Subscribe to a topic
    mqttClient.subscribe('sensors/#', (err) => {
        if (err) {
            console.error('Failed to subscribe to MQTT topics:', err);
        } else {
            console.log('Subscribed to MQTT topics');
        }
    });
});

// Handle incoming MQTT messages
mqttClient.on('message', (topic, message) => {
    const payloads = [
        {
            topic: kafkaTopic,
            messages: message.toString(),
        },
    ];

    // Send message to Kafka topic
    producer.send(payloads, (err, data) => {
        if (err) {
            console.error('Error sending data to Kafka:', err);
        } else {
            console.log(`Sent data to Kafka topic '${kafkaTopic}':`, data);
        }
    });
});

// Handle MQTT client error event
mqttClient.on('error', (err) => {
    console.error('Error with MQTT Client:', err);
});
