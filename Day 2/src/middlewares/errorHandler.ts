import { Request, Response, NextFunction } from 'express';

const logger = require('../lib/logger');


module.exports = (err: any,req: Request,res: Response,next: NextFunction) => {
    const status = err.statusCode || err.status || 500;
    const message = err.message || 'Внутренняя ошибка сервера';
    logger.error(err.message, { stack: err.stack });
    return res.status(status).json({ error: message });
}