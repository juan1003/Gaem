const express = require('express')
const app = express()
const logger = require('morgan')
const path = require('path')
const port = 3000
app.use(logger('dev'))
app.use(express.static('public'))

app.get('/', function(res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(port, function() {
  console.log('Listening on http://localhost:' + port)
})