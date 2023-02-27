const express = require('express');
const router = express.Router();
const {
  getSolicitudes,
  getSolicitudById,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud,
  lastlocation
} = require('../controllers/solicitudController');

// Obtener todas las solicitudes
router.get('/', getSolicitudes);

// Obtener una solicitud por ID
router.get('/:id', getSolicitudById);

// Crear una nueva solicitud
router.post('/', createSolicitud);

// Actualizar una solicitud existente
router.put('/:id', updateSolicitud);

// Eliminar una solicitud existente
router.delete('/:id', deleteSolicitud);

//ubicacion de el origen de la ultima solicitud cerrada
router.post('/lastlocation', lastlocation);

module.exports = router;
