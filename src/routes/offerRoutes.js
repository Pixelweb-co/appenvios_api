const express = require('express');
const router = express.Router();
const {
  obtenerOfertas,
  crearOferta,
  obtenerOfertaPorId,
  actualizarOferta,
  eliminarOferta
} = require('../controllers/offerController');

// Rutas para ofertas
router.get('/', obtenerOfertas);
router.post('/', crearOferta);
router.get('/:id', obtenerOfertaPorId);
router.put('/:id', actualizarOferta);
router.delete('/:id', eliminarOferta);

module.exports = router;
