const {Router} = require('express');
const {check} = require('express-validator');
const { categoriasGet, crearCategoria, categoriaById, actualizarCategoria,eliminarCategoria } = require('../controllers/categorias');

const {validarCampos, validarJWT} = require('../middlewares');

const router = Router();

/**
 * Obtener todas las categorías
 */
router.get('/',[
    validarJWT, 
    check('limite','El parámetro límite debe ser un número').optional().isNumeric(),
    check('desde', 'El parámetro desde debe ser un número').optional().isNumeric(),
    validarCampos
],categoriasGet)

/**
 * Obtener una categoría por id
 */
router.get('/:id',[
    validarJWT,    
    check('id', 'Debe de indicar un id de categoría').not().isEmpty(),
    check('id','El id indicado no es un Id de MongoDb').isMongoId(),
    validarCampos
],categoriaById)

/**
 * Crear categoría - privado - cualquier pesona con un token válido
 */
router.post('/',[
    validarJWT,    
    check('nombre', 'El nombre de la categoría es obligatorio').not().isEmpty(),    
    validarCampos
], crearCategoria)

/**
 * Actualizar - privado - cualquier token válido
 */

 router.put('/:id',[
    validarJWT,    
    check('id', 'Debe de indicar un id de categoría').not().isEmpty(),
    check('id','El id indicado no es un Id de MongoDb').isMongoId(),
    check('nombre', 'El nombre de la categoría es obligatorio').not().isEmpty(),   
    validarCampos
],actualizarCategoria)

/**
 * Borrar categoría - privado - cualquier token válido
 */
router.delete('/:id',[
    validarJWT,
    check('id', 'Debe de indicar un id de categoría').not().isEmpty(),
    check('id','El id indicado no es un Id de MongoDb').isMongoId(),
    validarCampos
],eliminarCategoria)


module.exports = router;