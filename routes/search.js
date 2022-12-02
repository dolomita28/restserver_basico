const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares')
const { search } = require('../controllers/search');

const router = Router();

// route for searches

router.get('/:coleccion/:termino',[
    check('coleccion', 'coleccion is mandatory').not().isEmpty(),
    check('termino', 'termino is mandatory').notEmpty(),
    validarCampos
],search)

module.exports = router;