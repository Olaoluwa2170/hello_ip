const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Visitor';
    const clientIp = req.ip;

    // Replace with your IPStack API key
    const ipstackApiKey = '3603411b489e490fe3f455f0bf710b76';
    const ipstackUrl = `http://api.ipstack.com/${clientIp}?access_key=${ipstackApiKey}`;

    let location = 'Unknown';
    try {
        const ipstackResponse = await axios.get(ipstackUrl);
        location = await ipstackResponse.data.country_name || 'Nigeria';
    } catch (error) {
        console.error('Error fetching location:', error);
    }

    // Replace with your OpenWeatherMap API key
    const weatherApiKey = process.env.OPENWEATHER_API;
    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=${weatherApiKey}`

    let temperature = '73';
    try {
        const weatherResponse = await axios.get(weatherUrl);
        temperature = await weatherResponse.data.main.temp;
        console.log(weatherResponse.data)
    } catch (error) {
        console.error('Error fetching weather:', error);
    }

    const greeting = await `hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`;

    res.json({
        client_ip: clientIp,
        location: location,
        greeting: greeting
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
