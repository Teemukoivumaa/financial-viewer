const express = require('express')
const path = require('path')
let app = express()
let port = process.env.PORT || 8090

const dir = path.join('./')
app.use(express.static(dir));

app.get('/', async function(req, res) {
    console.log("Site pinged")

    res.sendFile(path.join(__dirname, 'main.html'))
})

app.listen(port, function () {
    console.log("Server started in port: " + port)
})

console.log("-------------\n\n")