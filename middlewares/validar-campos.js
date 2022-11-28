const { validationResult } = require("express-validator")
const { response, request } = require('express')

const validarCampos = ( req = request, res = response, next ) => {

    /**Validacion de errores de express validator 
     * estas comprobaciones estan definidas en las rutas
    */
     const errors = validationResult(req)
     if( !errors.isEmpty() ){
         return res.status(400).json(errors)
     }
     /**Esta funcion se ejecuta llama igual en las rutas */

     next()

}

module.exports = {
    validarCampos
}