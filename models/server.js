const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')
const fileUpload = require('express-fileupload')

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT

        //Conectar a base de datos
        this.conectDB()

        //Middlewares
        this.middlewares()

        //Rutas de la apliacion
        //this.usuariosPath = '/api/users'
        //this.authPath = '/api/auth'

        this.paths = {
            authPath: '/api/auth',
            usersPath: '/api/users',
            playersPath: '/api/players',
            teamsPath: '/api/teams'
        }
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
        // Fileupload - carga de archivos
        this.app.use( fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true,
        }))
    }

    routes() {
        /*this.app.get('/api', (req, res) => {
            res.json({
                ok: true,
                msg: "Get API"
            })
        })*/

        this.app.use(this.paths.usersPath, require('../routes/users.routes'))
        this.app.use(this.paths.authPath, require('../routes/auth.routes'))
        this.app.use(this.paths.playersPath, require('../routes/players.routes'))
        this.app.use(this.paths.teamsPath, require('../routes/teams.routes'))
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('server on port', this.port)
        })
    }
}

module.exports = Server;