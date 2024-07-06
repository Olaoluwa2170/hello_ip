const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Visitor';
    const clientIp = req.ip;

    // Replace with your IPStack API key
    // const ipstackApiKey = '3603411b489e490fe3f455f0bf710b76';
    const ipstackUrl = `http://api.ipstack.com/${clientIp}?access_key=3603411b489e490fe3f455f0bf710b76`;

    let location = 'Unknown';
    try {
        const ipstackResponse = await axios.get(ipstackUrl);
        location = await ipstackResponse.data.country_name;
    } catch (error) {
        console.error('Error fetching location:', error);
    }

    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=a4f02e3b7db39236397be428fc8efcc0`

    let temperature = 'unknown';
    try {
        const weatherResponse = await axios.get(weatherUrl);
        temperature = await weatherResponse.data.city.coord.lat;
        location == null ? location = weatherResponse.data.city.name : location = location
    } catch (error) {
        console.error('Error fetching weather:', error);
    }

    const greeting = `hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`;

    res.json({
        client_ip: clientIp,
        location: location,
        greeting: greeting
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
