// data.js
const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://localhost:1883'); // Replace with your broker URL
const topic = 'patient/data';

// Define the patients and nurses
const nurses = [
    { id: 1, name: 'Nurse 1' },
    { id: 2, name: 'Nurse 2' }
];

const patients = [
    { id: 1, name: 'Patient 1', nurseId: 1, bmi: null, bloodPressure: null, heartRate: null, temperature: null, alertMessage: '' },
    { id: 2, name: 'Patient 2', nurseId: 2, bmi: null, bloodPressure: null, heartRate: null, temperature: null, alertMessage: '' }
];

// Generate random data for the last week
function generateRandomData() {
    return {
        bmi: (Math.random() * 30 + 15).toFixed(2), // Random BMI between 15 and 45
        bloodPressure: `${Math.floor(Math.random() * 40 + 90)}/${Math.floor(Math.random() * 30 + 60)}`, // Random BP
        heartRate: Math.floor(Math.random() * 40 + 60), // Random heart rate between 60 and 100
        temperature: (Math.random() * 5 + 36).toFixed(1) // Random temperature between 36°C and 41°C
    };
}

setInterval(() => {
    patients.forEach(patient => {
        const randomData = generateRandomData();
        patient.bmi = randomData.bmi;
        patient.bloodPressure = randomData.bloodPressure;
        patient.heartRate = randomData.heartRate;
        patient.temperature = randomData.temperature;

        // Validate and generate alert messages
        patient.alertMessage = validatePatientData(patient); // Update alert message

        client.publish(topic, JSON.stringify(patient), { qos: 1 }, (err) => {
            if (err) {
                console.error('Failed to publish message:', err);
            } else {
                console.log('Published patient data:', patient);
            }
        });
    });
}, 30000); // Publish every 30 seconds

// Validate patient data
function validatePatientData(patient) {
    let alertMessage = '';

    // Validate BMI
    if (patient.bmi < 18.5) {
        alertMessage += `${patient.name}: Low BMI! Check the patient.<br>`;
    } else if (patient.bmi > 25) {
        alertMessage += `${patient.name}: High BMI! Check the patient.<br>`;
    }

    // Validate Blood Pressure (Assuming normal is 90/60 to 120/80)
    const [systolic, diastolic] = patient.bloodPressure.split('/').map(Number);
    if (systolic < 90 || diastolic < 60) {
        alertMessage += `${patient.name}: Low blood pressure! Check the patient.<br>`;
    } else if (systolic > 120 || diastolic > 80) {
        alertMessage += `${patient.name}: High blood pressure! Check the patient.<br>`;
    }

    // Validate Heart Rate (Assuming normal is 60 to 100 bpm)
    if (patient.heartRate < 60) {
        alertMessage += `${patient.name}: Low heart rate! Check the patient.<br>`;
    } else if (patient.heartRate > 100) {
        alertMessage += `${patient.name}: High heart rate! Check the patient.<br>`;
    }

    // Validate Temperature (Assuming normal is 36°C to 37.5°C)
    if (patient.temperature < 36) {
        alertMessage += `${patient.name}: Low temperature! Check the patient.<br>`;
    } else if (patient.temperature > 37.5) {
        alertMessage += `${patient.name}: High temperature! Check the patient.<br>`;
    }

    return alertMessage;
}
