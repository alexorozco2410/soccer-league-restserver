const {Router} = require('express')
const usersController = require('../controllers/users.controller')

const router = Router()

/* router.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: "Get API"
    })
}) */

router.get('/', usersController.getUsers)

router.put('/:id', usersController.putUsers)

router.post('/', usersController.postUsers)

router.delete('/', usersController.delUsers)

router.patch('/', usersController.patchUsers)

module.exports = router