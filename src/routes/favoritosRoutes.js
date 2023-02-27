const express = require('express');
const favoritosController = require('../controllers/favoritosController');

const router = express.Router();

router.get('/', favoritosController.getAll);
router.post('/', favoritosController.create);
router.delete('/:id', favoritosController.delete);
router.post('/setfavorite', favoritosController.setfavorite);
router.post('/obtenerFavoritos', favoritosController.obtenerFavoritos);


module.exports = router;
