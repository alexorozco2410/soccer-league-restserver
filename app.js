require('dotenv').config()

const Server = require('./models/server')

// const express = require('express')
// const app = express()

/*app.get('/', function (req, res) {
  res.send('Hello World')
})*/

/*app.listen( process.env.PORT, () => {
    console.log('server on port', process.env.PORT)
} )*/

const server = new Server()
server.listen()