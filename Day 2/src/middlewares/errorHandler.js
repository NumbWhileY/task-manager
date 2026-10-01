module.exports = (err,req,res,next) => {
    const status = err.status || 500;
    const message = err.message || 'Внутренняя ошибка сервера';
    console.error(err.stack);
    return res.status(status).json({ error: message })
}