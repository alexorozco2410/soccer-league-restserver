const { Router } = require('express')
const { check } = require('express-validator')

const { validateJWT } = require('../middlewares/validate-jwt')
const { validarCampos } = require('../middlewares/validar-campos')
const { hasRole } = require('../middlewares/validate-role')

const { checkPlayerById } = require('../helpers/db-validators')

const playersController = require('../controllers/players.controller')

const router = Router()

/**
 * {{url}}/api/players
 */

// Obtener todos los jugadores registrados
router.get('/',[
    validateJWT,
], playersController.getPlayers)

// Obtener un unico jugador de la base de datos
router.get('/:id',[
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( checkPlayerById ),
    validarCampos
], playersController.getPlayerById)

//Registrar nuevo jugador
router.post('/',[
    validateJWT,
    hasRole('ADMIN_ROLE', 'MANAGER_ROLE'),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('surname', 'El apellido es obligatorio').not().isEmpty(),
    check('birthday', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    validarCampos
], playersController.createPlayer)

//Registrar nuevo jugador y asignarlo a un equipo
router.post('/assign-team/:idTeam',[
    validateJWT,
    hasRole('ADMIN_ROLE', 'MANAGER_ROLE'),
    check('idTeam', 'No es un ID válido').isMongoId(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('surname', 'El apellido es obligatorio').not().isEmpty(),
    check('birthday', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    validarCampos
], playersController.createAndAssignPlayer)

//pruebas de archivos
router.put('/update-image/:id',[
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( checkPlayerById ),
    validarCampos
], playersController.updatePlayerImg)

//Actualizar informacion de un jugador
router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( checkPlayerById ),
    validarCampos
], playersController.updatePlayer)

//Desabilitar jugador pero no borrar de la base de datos
router.put('/disable-player/:id',[
    validateJWT,
    hasRole('ADMIN_ROLE', 'MANAGER_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( checkPlayerById ),
    validarCampos
], playersController.disablePLayer)

//Borrar jugador
router.delete('/:id',[
    validateJWT,
    hasRole('ADMIN_ROLE', 'MANAGER_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( checkPlayerById ),
    validarCampos
], playersController.deletePlayer)

module.exports = router