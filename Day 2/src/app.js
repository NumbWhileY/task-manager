const express = require('express')
const logger = require('./middlewares/logger.js')
const app = express()
const tasksRouter = require('./routes/tasks');
const notFound = require('./middlewares/notFound');

app.disable('x-powered-by');
app.use(express.json())
app.use(logger)
app.get('/', (req, res) => {
    res.json({ message: 'Hello world' });
});
app.use('/tasks', tasksRouter);
app.use(notFound)



module.exports = app;