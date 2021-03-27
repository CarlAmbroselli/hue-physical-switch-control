# Physical switch to control Hue light

## About

This library allows you to use a wall switch that controls an outlet to toggle a hue light (and keep the hue light connected to power).

## Required parts
- ESP8622 NodeMCU
- (optional) IOT device that is conencted to the wall switch outlet and outputs 3.3V when there is power on the outlet (and otherwise looses power). You can also cut a USB cable directly and connect use that via a 1000 Ohm resistor, but that will then take quite a while to toggle the switch because it takes time until the current is fully gone, I'm using an Arduino Nano that I had laying around
- 1k Ohm resistor and 220 Ohm resistor
- Breadboard + Cables
- Something that can run nodejs to talk to the bridge (I'm using a raspberry pi that is running homebridge anyhow)

![Board Layout](https://github.com/CarlAmbroselli/hue-physical-switch-control/blob/main/images/layout.jpg?raw=true)

If you don't have the right resistors you can also use others. The ESP8622 can read currents of up to 1V, the NodeMCU version can even go up to 3.3V. Make sure to stay below these and use the following formula to calculate:

<img width="200" alt="Formula" src="https://github.com/CarlAmbroselli/hue-physical-switch-control/blob/main/images/formula.png?raw=true">

Since we are using a 1000 Ohm and a 220 Ohm resistor, the calculation is `3.3V * (220 / (220 + 1000)) = 0.6V` that we have here, which is fine. If you change these you will probably need to update the values in `nodemcu_code.txt` that are used as thresholds in the loop (I'm using `sensorValue > 150` and `sensorValue < 80`).

## Setup

1. Connect any IOT device that can output 3.3V to the power supply that is connected to the wall outlet that gets toggeled with the physical button.
2. Connect it to the ESP8622 as displayed on the picture above.
3. Install the code from `nodemcu_code.txt` onto the ESP8600 using the Arduino IDE (make sure to update the IP of your webserver, as well as your WiFi SSID and password)
4. On your raspberry pi, clone this repo and then copy `config.yaml.template` to `config.yaml` and configure it with your Hue bridge IP, token and the port that you configured when you flashed your ESP8600
5. Add running this code to your crontab: `@reboot sh -c 'cd /path/to/your/app/folder && pm2 start index.js'`
6. Start the server manually `sh -c 'cd /path/to/your/app/folder && pm2 start index.js'`
