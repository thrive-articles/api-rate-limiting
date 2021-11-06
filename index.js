const express = require('express');
const app = express();
const redis = require('./redis');

app.get('/route-a', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const requests = await redis.incr(ip);
    console.log(`Number of requests made so far ${requests}`);
    if(requests === 1){
        await redis.expire(ip, 60);
    }
    if(requests > 5){
        res.status(503).json({
            response: 'Error',
            callsMade: requests,
            msg: 'Too many calls made'
        });
    }
    else 
    res.json('You have successfully hit route-a');
})

app.get('/route-b', (req, res) => {
    res.json('You have successfully hit route-b');
})

app.listen(3000, () => {
    console.log('Server started');
})  