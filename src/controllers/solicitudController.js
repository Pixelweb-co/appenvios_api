const Solicitud = require('../models/solicitud');

const getSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.find();
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSolicitudById = async (req, res) => {
  try {
    const solicitud = await Solicitud.findById(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ message: 'No se encontró la solicitud' });
    }
    res.status(200).json(solicitud);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSolicitud = async (req, res) => {
  const solicitud = new Solicitud(req.body);
  try {
    const newSolicitud = await solicitud.save();
    res.status(201).json(newSolicitud);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(solicitud);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findByIdAndDelete(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ message: 'No se encontró la solicitud' });
    }
    res.status(200).json({ message: 'Solicitud eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSolicitudes,
  getSolicitudById,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud,
};
