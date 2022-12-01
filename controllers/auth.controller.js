const { request, response } = require('express')
const bcrypt = require('bcryptjs')

const UserModel = require('../models/user.model')

const { generateJWT } = require('../helpers/generate-jwt')

const login = async( req = request, res = response ) => {

    const { email, password } = req.body

    try{
        //verificar si el email existe
        const user = await UserModel.findOne({ email })
        if ( !user ) {
            return res.status(400).json({
                msg: 'Usuario o Contraseña son incorrectos -- Correo'
            })
        }

        //verificar si el usuario esta activo en la base de datos
        if ( !user.status ) {
            return res.status(400).json({
                msg: 'Usuario o Contraseña son incorrectos -- status: false'
            })
        }

        //verificar la contraseña
        const validPassword = bcrypt.compareSync( password, user.password )
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario o Contraseña son incorrectos -- password'
            })
        }

        //Generar JWT
        const token = await generateJWT( user.id )

        res.json({
            msg: 'Login Controller',
            user,
            token,
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    login
}