const path = require('path')
const fs = require('fs')

const { response, request } = require('express')
const { uploadFile } = require('../helpers/upload-file')

const TeamModel = require('../models/team.model')

const getTeams = async(req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query

    const [total, players] = await Promise.all([
        TeamModel.countDocuments({ status: true }),
        TeamModel.find({ status: true })
            .skip( Number(from) )
            .limit( Number(limit) )
    ])

    res.status(200).json({
        total,
        players,
        
    })
}

const getTeamById = async(req = request, res = response) => {

    try{
        const team = await TeamModel.findOne({_id: req.params.id})

        res.status(200).json({
            team
        })

    } catch( error ) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador de la base de datos'
        })
    }
}

const createTeam = async(req = request, res = response) => {

    try {
        const registerUser = req.authUser._id
        const currentDate = new Date()
        const registerDate = `${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`

        const { name, category } = req.body

        const team = new TeamModel({ name, category, registerDate, registerUser })

        await team.save()

        res.status(201).json({
            msg: 'se registro el nuevo equipo',
            team,
        })

    } catch( error ) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador de la base de datos'
        })
    }
}

const updateTeam = async(req = request, res = response) => {

    const id = req.params.id
    const { ...rest } = req.body

    const team = await TeamModel.findByIdAndUpdate( id, rest )

    res.status(200).json({
        msg: "Update team controller",
        team
    })
}

const updateTeamImg = async(req = request, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.newFile) {
        return res.status(400).json({
            msg: 'No hay archivos en la peticion'
        })
    }

    try {

        const { id } = req.params
        const team = await TeamModel.findById( id )

        const fileName = await uploadFile( req.files, undefined, 'teams' )

        if ( team.logo ) {
            const pathImg = path.join( __dirname, '../uploads/teams', team.logo)
            if ( fs.existsSync( pathImg ) ) {
                fs.unlinkSync( pathImg )
            }
        }

        team.logo = fileName

        await team.save()

        return res.status(200).json({
            fileName,
            team
        })
        
    } catch( error ) {
        return res.status(400).json({
            msg: error
        })
    }
    
}

const deleteTeam = async(req = request, res = response) => {

    try {
        const { id } = req.params
        const team = await TeamModel.findByIdAndDelete( id )

        res.status(200).json({
            msg: "equipo eliminado de la base de datos",
            team,
        })

    } catch( error ) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador de la base de datos'
        })
    }
}

const disableTeam = async(req = request, res = response) => {

    res.json({
        msg: 'disable team controller'
    })
}

module.exports = {
    getTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    disableTeam,
    updateTeamImg,
}