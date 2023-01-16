const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos } = require('../middlewares/validar-campos')
const { validateJWT } = require('../middlewares/validate-jwt')

const authController = require('../controllers/auth.controller')


const router = Router()

router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], authController.login)

router.post('/register',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], authController.register)

router.get('/renew', [
    validateJWT
], authController.revalidateJWT)

module.exports = router