require('dotenv').config();


const express = require('express')
const PORT = 3001
const app = require('./app.js')
const logger = require('./lib/logger');



app.listen(PORT, () => {
    logger.info(`Server is running on ${PORT}`);
});