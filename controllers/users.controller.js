const { response, request } = require('express')
const bcrypt = require('bcryptjs')

const User = require('../models/user.model')

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
    const { password, google, ...rest } = req.body

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

    

    const { name, password, email, role } = req.body
    const user = new User({ name, password, email, role })

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

    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync()
    user.password = bcrypt.hashSync( password, salt )

    //guardar en BD
    await user.save()

    res.json({
        msg: "Post API - Controller",
        user
    })
}

const delUsers = async(req, res = response) => {

    const { id } = req.params

    // borrar fisicamente 
    // const user = await User.findByIdAndDelete( id )

    const user = await User.findByIdAndUpdate( id, { status: false } )

    res.json({
        msg: "Delete API - Controller",
        user
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