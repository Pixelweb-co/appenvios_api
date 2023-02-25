const mongoose = require('mongoose');


var Solicitud = mongoose.model("Solicitudes", {
  id: Number,
  id_client: String,
  client_data: Object,
  id_driver: String,
  status: String,
  comments: Object,
  destinations: Array,
  tarifa: Object,
  type: String,
  origin: Object,
  fecha: Date,
});

module.exports = Solicitud;

