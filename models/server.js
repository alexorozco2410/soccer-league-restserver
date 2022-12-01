const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT

        //Conectar a base de datos
        this.conectDB()

        //Middlewares
        this.middlewares()

        //Rutas de la apliacion
        this.usuariosPath = '/api/users'
        this.authPath = '/api/auth'
        this.routes()
    }

    async conectDB() {
        await dbConnection()
    }

    middlewares() {
        //cors
        this.app.use( cors() )
        //Lectura y parseo del body (serializa la info del body)
        this.app.use( express.json() )
        //directorio publico
        this.app.use(express.static('public'))
    }

    routes() {
        /*this.app.get('/api', (req, res) => {
            res.json({
                ok: true,
                msg: "Get API"
            })
        })*/

        this.app.use(this.usuariosPath, require('../routes/users.routes'))
        this.app.use(this.authPath, require('../routes/auth.routes'))
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('server on port', this.port)
        })
    }
}

module.exports = Server;