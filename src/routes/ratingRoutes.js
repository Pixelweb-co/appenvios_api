const express = require('express');
const favoritosController = require('../controllers/ratingController');

const router = express.Router();

router.get('/', favoritosController.getAll);
router.post('/', favoritosController.create);
router.delete('/:id', favoritosController.delete);
router.post('/setrating', favoritosController.setRating);
router.post('/obtenerratings', favoritosController.obtenerRatings);


module.exports = router;
