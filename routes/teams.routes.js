const { Router } = require('express')
const { check } = require('express-validator')

const { validateJWT } = require('../middlewares/validate-jwt')
const { validarCampos } = require('../middlewares/validar-campos')
const { hasRole } = require('../middlewares/validate-role')

const { checkTeamById } = require('../helpers/db-validators')

const teamsController = require('../controllers/teams.controller')

const router = Router()

/**
 * {{url}}/api/players
 */

// Obtener todos los equipos registrados
router.get('/',[
    validateJWT,
], teamsController.getTeams)

// Obtener un unico equipo de la base de datos
router.get('/:id',[
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( checkTeamById ),
    validarCampos
], teamsController.getTeamById)

//Registrar nuevo equipo
router.post('/',[
    validateJWT,
    hasRole('ADMIN_ROLE'),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'La categoria del equipo es obligatoria').not().isEmpty(),
    validarCampos
], teamsController.createTeam)

//Actualizar informacion de un equipo
router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( checkTeamById ),
    validarCampos
],teamsController.updateTeam)

//Actualizar imagen de equipo
router.put('/update-image/:id',[
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( checkTeamById ),
    validarCampos
], teamsController.updateTeamImg)

//Desabilitar equipo pero no borrar de la base de datos
router.put('/disable-player/:id',[
    validateJWT,
    hasRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
], teamsController.disableTeam)

//Borrar equipo
router.delete('/:id',[
    validateJWT,
    hasRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
], teamsController.deleteTeam)

module.exports = router