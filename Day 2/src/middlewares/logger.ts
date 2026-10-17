const logger = require('../lib/logger');

module.exports = (req: any, res: any, next: any) => {
    logger.info(`${req.method} ${req.url}`);
    next();
};