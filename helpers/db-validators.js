const PlayerModel = require('../models/player.model')
const RoleModel = require('../models/role.model')
const UserModel = require('../models/user.model')
const TeamModel = require('../models/team.model')

const checkValidRole = async(role = '') => {
    const roleExist = await RoleModel.findOne({ role })
    if( !roleExist ){
        throw new Error(`El rol ${ role } no está registrado en la base de datos`)
    }
}

const checkEmailExist = async(email = '') => {
    const emailExist = await UserModel.findOne({ email })
    if( emailExist ) {
        throw new Error(`El correo ${ email } ya está registrado`)
    }
}

const checkUserById = async( id ) => {
    const userExist = await UserModel.findById(id)
    if( !userExist ) {
        throw new Error(`El id: ${ id } no existe`)
    }
}

const checkPlayerById = async( id ) => {
    const playerExist = await PlayerModel.findById(id)
    if( !playerExist ) {
        throw new Error(`El id: ${ id } no existe`)
    }
}

const checkTeamById = async( id ) => {
    const teamExist = await TeamModel.findById(id)
    if( !teamExist ) {
        throw new Error(`El id: ${ id } no existe`)
    }
}

module.exports = {
    checkValidRole,
    checkEmailExist,
    checkUserById,
    checkPlayerById,
    checkTeamById,
}