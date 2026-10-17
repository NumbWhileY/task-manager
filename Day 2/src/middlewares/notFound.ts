module.exports = (req:any,res:any,next:any) => {
        res.status(404).json({ error: "Не найдено" })
}