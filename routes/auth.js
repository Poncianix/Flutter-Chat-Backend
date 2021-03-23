/*
path: api/login
*/
const {Router} = require('express');
const { check } = require('express-validator');

const {crearUsuario,login,renewToken,} = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.post('/new',[
    check('nombre','El nombre es necesario').not().isEmpty(),
    check('email','El email es necesario').isEmail(),
    check('password','La contrasena es necesaria').not().isEmpty(),
    validarCampos
] ,crearUsuario);

router.post('/',[
    check('email','El email es necesario').isEmail(),
    check('password','La contrasena es necesaria').not().isEmpty(),
] ,login);
router.get('/renew', validarJWT,renewToken)
module.exports = router;