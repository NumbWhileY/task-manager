const jwt = require('jsonwebtoken')
const {UnauthorizedError} = require('../errors')

module.exports = (req:any,res:any,next:any) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Требуется авторизация'));
}

    const token = authHeader.split(' ')[1];


    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId };
        next();
    } catch (err) {
        next( new UnauthorizedError('Невалидный токен'));
    }
}