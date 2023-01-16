const { request, response } = require('express')
const bcrypt = require('bcryptjs')

const UserModel = require('../models/user.model')

const { generateJWT } = require('../helpers/generate-jwt')
const { generateDiscriminator } = require('../helpers/generate-discriminator')

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

const revalidateJWT = async( req = request, res = response ) => {

    try {
        const authUser = req.authUser
        const newJwt = await generateJWT( authUser._id )
        res.json({
            user: authUser,
            token: newJwt
        })

    } catch(error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const register = async( req = request, res = response ) => {
    try {
        const { userName, name, lastName, password, email } = req.body
        const role = 'USER_ROLE'
        const user = new UserModel({ userName, name, lastName, password, email, role })
        const tag = await generateDiscriminator( user._id, userName )

        user.discriminator = tag
        
        //Encriptar la contraseña
        const salt = bcrypt.genSaltSync()

        user.password = bcrypt.hashSync( password, salt )

        //guardar en BD
        await user.save()

        const token = await generateJWT( user._id )

        res.json({
            msg: "registro completado",
            user,
            token
        })

    } catch(error) {
        console.log(error)
        res.json({
            msg: "Hable con el administrador de la base de datos",
        })
    }
}
module.exports = {
    login,
    revalidateJWT,
    register,
}