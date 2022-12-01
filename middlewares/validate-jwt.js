const { request, response } = require('express')
const jwt = require('jsonwebtoken')

const UserModel = require('../models/user.model')

const validateJWT = async( req = request, res = response, next ) => {
    const token = req.header('x-token')
    //console.log(token)

    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY )
        // console.log(payload)

        // leer usuario que corresponde al uid en bd
        const authUser = await UserModel.findById( uid )

        if ( !authUser ) {
            return res.status(401).json({
                msg: 'Token no válido - El usuario no existe en la base de datos'
            })
        }

        // comprobar que el usuario no esta eliminado
        if ( !authUser.status ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            })
        }

        req.authUser = authUser
        next()

    } catch( error ) {
        console.log(error)
        res.status(401).json({
            msg: 'token no válido'
        })
    }

}

module.exports = {
    validateJWT
}