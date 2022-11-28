const {Router} = require('express')
const { check } = require('express-validator')

const { checkValidRole, checkEmailExist, checkUserById } = require('../helpers/db-validators')
const { validarCampos } = require('../middlewares/validar-campos')
// const RoleModel = require('../models/role.model')

const usersController = require('../controllers/users.controller')

const router = Router()

/* router.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: "Get API"
    })
}) */

router.get('/', usersController.getUsers)

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( checkUserById ),
    check('role').custom( checkValidRole ),
    validarCampos
], usersController.putUsers)

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener mas de 5 caracteres').isLength({ min: 6 }),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom( checkEmailExist ),
    // check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE'])
    
    /* custom check de un rol valido en base de datos
    los custom checks se pasaran a un archivo de funciones en hlepers
    para tener acceso a ellos como funciones genericas en
    db-validators.js
    check('role').custom( async(role = '') => {
        const roleExist = await RoleModel.findOne({ role })
        if( !roleExist ){
            throw new Error(`El rol ${ role } no está registrado en la base de datos`)
        }
    }),
    */
    // check('role').custom( (role) => checkValidRole(role) ), esta forma igual es valida
    check('role').custom( checkValidRole ),
    validarCampos
], usersController.postUsers)

router.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( checkUserById ),
    validarCampos
], usersController.delUsers)

router.patch('/', usersController.patchUsers)

module.exports = router