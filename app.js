const express = require('express')
const app = express()
const path = require('path')
const port = process.env.port
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname + "/simpleGrid.html")))
app.listen(port, () => console.log(`Example app listening on port port!`))