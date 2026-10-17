const pino = require('pino');

const isTest = process.env.NODE_ENV === 'test';
const isProd = process.env.NODE_ENV === 'production';

const logger = pino({
    level: isTest ? 'silent' : (isProd ? 'info' : 'debug'),
    transport: (isTest || isProd) ? undefined : {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
        }
    }
});

module.exports = logger;