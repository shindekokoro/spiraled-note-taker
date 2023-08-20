const config = require('./config/config.json')
const express = require('express');
const server = express();

server.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
});

server.get('/', (request, response) => {
    console.log(__dirname);
    response.sendFile(__dirname, config.index);
})