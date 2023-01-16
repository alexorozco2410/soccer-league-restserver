const { v4: uuidv4 } = require('uuid')

const UserModel = require('../models/user.model')

const createRandomNumber = ( uid ) => {
    const myuid = String(uid)
    strId = myuid.substring( myuid.length - 4, myuid.length)

    const aux = new Date('2023-01-13')
    const epoch = aux.getTime()

    const currentTime = Date.now() - epoch;
    let binary = '0' + currentTime.toString(2) + parseInt(strId, 36).toString(2)

    //generate random number
    const random = uuidv4()
    binary = binary + parseInt(random, 36).toString(2)

    const newNumber = (parseInt(binary, 2)).toString(36).substr(2,8)
    const final = (parseInt(newNumber, 36).toString(10)).substr(2,5)
    
    return final
}

const generateDiscriminator = async( uid, userName ) => {

    let discriminator = ''
    let userTagExist = null
    do {
        discriminator = createRandomNumber( uid )
        userTagExist = await UserModel.findOne({ discriminator, userName })
    } while( userTagExist )
    // console.log(userTagExist)
    if ( !userTagExist ) {
        return discriminator
    } else {
        throw new Error(`No se pudo generar el tag del usuario`)
    }
        
}

module.exports = {
    generateDiscriminator
}