const mqtt = require("mqtt");
const SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');


const client = mqtt.connect('mqtt://broker.hivemq.com:1883');
const COMPort = "COM3"; //this is the port the arduino is connect to your computer
const port = new SerialPort(COMPort, 9600);
const parser = port.pipe(new Readline({ delimiter: '\n' }));


//CODE FOR MQTT DATA

//prints to console when the mqtt client connects to broker. Also subscribes to TFS channel if uncommented
client.on('connect', ()=>{
    console.log("Publisher connected");
    /*COMMENT THE NEXT LINE OUT IF YOU WANT TO BE A PUBLISHER/MASTER*/
    client.subscribe("TFS/#");
})

//this function receives a message and publishes it on the TFS/CONTROL channel.
function publishMqtt(message){
    client.publish("TFS/CONTROL", message)
}

client.on("message", (topic, message)=>{
    console.log("From Subscription");
    console.log(topic, message.toString())
    port.write(message);
})


//CODE FOR SERIAL TO ARDUINO

//prints to console when the arduino serial has connected.
function openPort(){
    console.log("Serial Connected");
}

// Switches the port into "flowing mode"
parser.on('data', function (data) {

    /*COMMENT THE NEXT LINE OUT IF YOU ARE A SLAVE*/
    publishMqtt("forward");
});

// Switches the port into "flowing mode"
port.on('open', openPort);
