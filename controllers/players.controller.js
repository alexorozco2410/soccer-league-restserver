const path = require('path')
const fs = require('fs')

const { response, request } = require('express')
const { uploadFile } = require('../helpers/upload-file')

const PlayerModel = require('../models/player.model')
const TeamModel = require('../models/team.model')

const getPlayers = async(req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query

    const [total, players] = await Promise.all([
        PlayerModel.countDocuments({ status: true }),
        PlayerModel.find({ status: true })
            .skip( Number(from) )
            .limit( Number(limit) )
    ])

    res.status(200).json({
        total,
        players,
        
    })
}

const getPlayerById = async(req = request, res = response) => {

    try{
        const player = await PlayerModel.findOne({_id: req.params.id})

        res.status(200).json({
            player
        })

    } catch( error ) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador de la base de datos'
        })
    }
}

const createPlayer = async(req = request, res = response) => {

    console.log(req.body)

    try {
        // console.log('datos mandados', req.body)
        const registerUser = req.authUser._id
        // console.log('usuario que hace el registro', registerUser)
        const currentDate = new Date()
        const registerDate = `${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`
        // console.log('fecha de registro', registerDate)

        const { name, surname, status, number, birthday, height, weight, positions, foot } = req.body

        const player = new PlayerModel({ name, surname, status, number, birthday, height, weight, positions, foot, registerDate, registerUser })

        /* if ( req.files !== null && Object.keys(req.files).length !== 0 && req.files.newFile) {
            try {
                const photo = await uploadFile( req.files, undefined, 'players' )
                player.photo = photo
                
            } catch( error ) {
                return res.status(400).json({
                    msg: error
                })
            }
        } */

        await player.save()

        return res.status(201).json({
            msg: 'Se registro el nuevo jugador',
            player
        })

    } catch( error ) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador de la base de datos'
        })
    }
}

const createAndAssignPlayer = async(req = request, res = response) => {

    try {
        // console.log('datos mandados', req.body)
        const registerUser = req.authUser._id
        // console.log('usuario que hace el registro', registerUser)
        const currentDate = new Date()
        const registerDate = `${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`
        // console.log('fecha de registro', registerDate)

        const { name, surname, status, number, birthday, height, weight, positions, foot } = req.body

        const player = new PlayerModel({ name, surname, status, number, birthday, height, weight, positions, foot, registerDate, registerUser })

        const newPlayerId = player._id

        const { idTeam } = req.params.idTeam
        const team = await TeamModel.findOne( idTeam )
        team.players.push( newPlayerId )

        await player.save()
        await team.save()

        res.status(201).json({
            msg: 'Se registro el nuevo jugador en el equipo',
            player,
            team
        })

    } catch( error ) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador de la base de datos'
        })
    }
}

const updatePlayerImg = async(req = request, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.newFile) {
        return res.status(400).json({
            msg: 'No hay archivos en la peticion'
        })
    }

    try {

        const { id } = req.params
        const player = await PlayerModel.findById( id )

        const fileName = await uploadFile( req.files, undefined, 'players' )

        if ( player.photo ) {
            const pathImg = path.join( __dirname, '../uploads/players', player.photo)
            if ( fs.existsSync( pathImg ) ) {
                fs.unlinkSync( pathImg )
            }
        }

        player.photo = fileName

        await player.save()

        return res.status(200).json({
            fileName,
            player
        })
        
    } catch( error ) {
        return res.status(400).json({
            msg: error
        })
    }
    
}

const updatePlayer = async(req = request, res = response) => {

    const id = req.params.id
    const { ...rest } = req.body

    const player = await PlayerModel.findByIdAndUpdate( id, rest )

    await player.save()

    res.status(200).json({
        msg: "Update player controller",
        player
    })
}

const deletePlayer = async(req = request, res = response) => {

    try {
        const { id } = req.params
        const player = await PlayerModel.findByIdAndDelete( id )

        res.status(200).json({
            msg: "Jugador eliminado de la base de datos",
            player,
        })

    } catch( error ) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador de la base de datos'
        })
    }
}

const disablePLayer = async(req = request, res = response) => {

    try{
        const { id } = req.params

        const player = await PlayerModel.findByIdAndUpdate( id, { status: false } )
        const authUser = req.authUser

        await player.save()

        res.status(200).json({
            msg: "Disable player controller",
            player,
            // uid
            authUser
        })

    } catch( error ) {
        res.json({
            msg: 'Hable con el administrador de la base de datos'
        })
    }
}

module.exports = {
    getPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer,
    disablePLayer,
    createAndAssignPlayer,
    updatePlayerImg,
}