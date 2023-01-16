const { response, request } = require('express')
const bcrypt = require('bcryptjs')

const User = require('../models/user.model')
const { generateDiscriminator } = require('../helpers/generate-discriminator')

const getUsers = async(req = request, res = response) => {

    // const query = req.query
    // const {nombre, a, apikey = 'no api key'} = req.query
    const { limit = 5, from = 0 } = req.query
   
    /*const users = await User.find({ status: true })
        .skip( Number(from) )
        .limit( Number(limit) );
    */
    
    // const total = await User.countDocuments({ status: true })

    const [total, users] = await Promise.all([
        User.countDocuments({ status: true }),
        User.find({ status: true })
            .skip( Number(from) )
            .limit( Number(limit) )
    ])

    res.json({
        /*msg: "Get API - Controller",
        nombre,
        a,
        apikey*/
        users,
        total
        
    })
}

const putUsers = async(req, res = response) => {

    const id = req.params.id
    const { password, ...rest } = req.body

    //validar con base de datos
    if ( password ) {
        const salt = bcrypt.genSaltSync()
        rest.password = bcrypt.hashSync( password, salt )
    }

    const user = await User.findByIdAndUpdate( id, rest )

    res.json({
        msg: "Put API - Controller",
        id
    })
}

const postUsers = async(req, res = response) => {

    /*Verificar si el correo existe
    se pasara esta funcionalidad a helpers y se utilizara
    la funcion en las rutas

    const emailExist = await User.findOne({ email })
    if( emailExist ) {
        return res.status(400).json({
            msg: 'El correo ya está registrado'
        })
    }
    */
    
    try {
        const { userName, name, lastName, password, email, role } = req.body
        const user = new User({ userName, name, lastName, password, email, role })
        const tag = await generateDiscriminator( user._id, userName )

        user.discriminator = tag
        
        //Encriptar la contraseña
        const salt = bcrypt.genSaltSync()

        user.password = bcrypt.hashSync( password, salt )

        //guardar en BD
        await user.save()

        res.json({
            msg: "Post API - Controller",
            user
        })

    } catch(error) {
        console.log(error)
        res.json({
            msg: "Hable con el administrador de la base de datos",
        })
    }
    
}

const delUsers = async(req, res = response) => {

    const { id } = req.params
    // const uid = req.uid

    // borrar fisicamente 
    // const user = await User.findByIdAndDelete( id )

    const user = await User.findByIdAndUpdate( id, { status: false } )
    const authUser = req.authUser

    res.json({
        msg: "Delete API - Controller",
        user,
        // uid
        authUser
    })
}

const patchUsers = (req, res = response) => {
    res.json({
        msg: "Patch API - Controller"
    })
}

module.exports = {
    getUsers,
    putUsers,
    postUsers,
    delUsers,
    patchUsers
}