const express = require('express')
const PORT = 3001
const app = require('./app.js')



app.listen(PORT,() => {
    console.log("Server is running on " + PORT)
})