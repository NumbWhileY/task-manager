const logger = require('../lib/logger');

module.exports = (req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
};