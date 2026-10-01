module.exports = (req,res,next) => {
    if (typeof req.body.title !== 'string' || req.body.title.trim() === ''){
        return res.status(400).json({'error': 'title должен быть непустой строкой'})
    }
    next()
}