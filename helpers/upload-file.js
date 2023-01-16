const path = require('path')
const { v4: uuidv4 } = require('uuid')

const uploadFile = ( files, validExtensions = ['png','jpg','jpeg','gif'], folder = '' ) => {

    return new Promise((resolve, reject) => {
        const { newFile } = files

        const cutName = newFile.name.split('.')
        const extension = cutName[ cutName.length - 1 ]

        //Validar la extension del archivo
        if ( !validExtensions.includes( extension.toLowerCase() ) ) {
            return reject(`La extension ${extension} no es permitida. ${validExtensions}`)
        }

        const tempName = uuidv4() + '.' + extension.toLowerCase()
        const uploadPath = path.join( __dirname, '../uploads/', folder, tempName )

        // Use the mv() method to place the file somewhere on your server
        newFile.mv(uploadPath, function(err) {
            if (err) {
                reject(err)
            }

            resolve( tempName )
        });
    })
}

module.exports = {
    uploadFile
}