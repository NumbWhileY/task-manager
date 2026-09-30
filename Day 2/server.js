const express = require('express')
const PORT = 3001
const app = express()



app.use(express.json())




app.use((req,res,next) => {
    console.log(req.method + " " + req.url)
    next()
})

app.get('/',(req,res) => {
    res.json({"message" : "Hello world"})
})

app.post('/tasks',(req,res) => {
    res.status(201).json({"received": req.body})
})


app.use((req,res) => {
    res.status(404).json({ error: "Не найдено" })
})




app.listen(PORT,() => {
    console.log("Server is running on " + PORT)
})