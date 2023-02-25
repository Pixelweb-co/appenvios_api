const Oferta = require('../models/offerModel');

// Obtener todas las ofertas
const obtenerOfertas = async (req, res) => {
  try {
    const ofertas = await Oferta.find();
    res.status(200).json(ofertas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva oferta
const crearOferta = async (req, res) => {
  const oferta = new Oferta(req.body);
  try {
    const nuevaOferta = await oferta.save();
    res.status(201).json(nuevaOferta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener una oferta por ID
const obtenerOfertaPorId = async (req, res) => {
  try {
    const oferta = await Oferta.findById(req.params.id);
    if (!oferta) {
      return res.status(404).json({ message: 'No se encontró la oferta' });
    }
    res.status(200).json(oferta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una oferta
const actualizarOferta = async (req, res) => {
  try {
    const oferta = await Oferta.findById(req.params.id);
    if (!oferta) {
      return res.status(404).json({ message: 'No se encontró la oferta' });
    }
    oferta.valor = req.body.valor;
    oferta.contratista = req.body.contratista;
    oferta.contratista_name = req.body.contratista_name;
    oferta.contratante = req.body.contratante;
    oferta.cliente = req.body.cliente;
    oferta.estado = req.body.estado;
    oferta.solicitud = req.body.solicitud;
    const ofertaActualizada = await oferta.save();
    res.status(200).json(ofertaActualizada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una oferta
const eliminarOferta = async (req, res) => {
  try {
    const oferta = await Oferta.findById(req.params.id);
    if (!oferta) {
      return res.status(404).json({ message: 'No se encontró la oferta' });
    }
    await oferta.remove();
    res.status(200).json({ message: 'Oferta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  obtenerOfertas,
  crearOferta,
  obtenerOfertaPorId,
  actualizarOferta,
  eliminarOferta
};
